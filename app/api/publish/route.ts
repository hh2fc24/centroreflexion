import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { readFile } from "fs/promises";
import path from "path";
import { getAdminSessionFromRequest } from "@/lib/server/adminAuth";
import { roleAtLeast } from "@/lib/server/roles";
import { withLock } from "@/lib/server/locks";
import { readPublishedDiskState, writePublishedDiskState, publishedPaths } from "@/lib/server/publishedDisk";
import { hashJson } from "@/lib/server/hash";
import { writeJsonAtomic } from "@/lib/server/atomicWrite";
import { sanitizePublishedState } from "@/lib/server/sanitizeSiteState";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";
import { appendAudit } from "@/lib/server/auditLog";

export const runtime = "nodejs";

type PublishBody = {
  theme: unknown;
  content: unknown;
  pages?: unknown;
  articles: unknown;
  baseHash?: string;
  validateBuild?: boolean;
  gitCommitPush?: boolean;
  commitMessage?: string;
};

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function run(cmd: string, args: string[]) {
  return new Promise<{ code: number; out: string }>((resolve) => {
    const child = spawn(cmd, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let out = "";
    child.stdout.on("data", (d) => (out += d.toString("utf8")));
    child.stderr.on("data", (d) => (out += d.toString("utf8")));
    child.on("close", (code) => resolve({ code: code ?? 1, out }));
  });
}

export async function POST(req: Request) {
  if (process.env.CRC_ENABLE_PUBLISH !== "1") {
    return NextResponse.json({ ok: false, error: "publish_disabled" }, { status: 404 });
  }

  const session = getAdminSessionFromRequest(req);
  if (!session) return unauthorized();
  if (!roleAtLeast(session.role, "publisher")) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  const ip = getClientIp(req);
  const rl = checkRateLimit(`publish:${session.user}:${ip}`, { limit: 12, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: PublishBody;
  try {
    body = (await req.json()) as PublishBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const logs: { step: string; code?: number; out?: string }[] = [];

  const nextState = sanitizePublishedState({
    theme: body.theme ?? {},
    content: body.content ?? {},
    pages: body.pages ?? [],
    articles: body.articles ?? {},
  });
  const nextHash = hashJson(nextState);

  const result = await withLock("published:write", async () => {
    const { hash: currentHash } = await readPublishedDiskState();
    if (body.baseHash && body.baseHash !== currentHash) {
      return NextResponse.json({ ok: false, error: "conflict", serverHash: currentHash }, { status: 409 });
    }

    try {
      await writePublishedDiskState(nextState);
      logs.push({ step: "write_files" });
      await appendAudit({
        user: session.user,
        role: session.role,
        action: "publish",
        entity: { kind: "site" },
        detail: (body.commitMessage || "").slice(0, 140) || undefined,
      });
    } catch (e: unknown) {
      const detail = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      return NextResponse.json({ ok: false, error: "write_failed", detail, logs }, { status: 500 });
    }

    // Version snapshot (local disk + repo)
    try {
      type VersionsIndex = {
        currentId: string | null;
        versions: { id: string; createdAt: number; message: string; user?: string }[];
      };

      const { versionsDir, versionsIndexPath } = publishedPaths();
      const versionId = `${new Date().toISOString().replace(/[:.]/g, "-")}-${Math.random().toString(16).slice(2, 8)}`;
      const createdAt = Date.now();
      const message = (body.commitMessage || `publish: ${new Date().toISOString()}`).slice(0, 140);
      const snapshotPath = path.join(versionsDir, `${versionId}.json`);
      await writeJsonAtomic(snapshotPath, {
        id: versionId,
        createdAt,
        message,
        user: session.user,
        theme: body.theme ?? {},
        content: body.content ?? {},
        pages: body.pages ?? [],
        articles: body.articles ?? {},
      });

      let index: VersionsIndex = { currentId: null, versions: [] };
      try {
        const raw = await readFile(versionsIndexPath, "utf8");
        const parsed = JSON.parse(raw) as unknown;
        if (parsed && typeof parsed === "object") {
          const maybe = parsed as Partial<VersionsIndex>;
          index = {
            currentId: typeof maybe.currentId === "string" ? maybe.currentId : null,
            versions: Array.isArray(maybe.versions) ? (maybe.versions as VersionsIndex["versions"]) : [],
          };
        }
      } catch {
        // ignore
      }
      const nextVersions = index.versions;
      nextVersions.unshift({ id: versionId, createdAt, message, user: session.user });
      index = { currentId: versionId, versions: nextVersions.slice(0, 50) };
      await writeJsonAtomic(versionsIndexPath, index);
      logs.push({ step: "version_snapshot", out: versionId });
    } catch (e: unknown) {
      const detail = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      logs.push({ step: "version_snapshot_failed", out: detail });
    }

    if (body.validateBuild) {
      const r = await run("npm", ["run", "build"]);
      logs.push({ step: "build", code: r.code, out: r.out });
      if (r.code !== 0) return NextResponse.json({ ok: false, error: "build_failed", logs }, { status: 500 });
    }

    if (body.gitCommitPush) {
      const msg = (body.commitMessage || "chore(publish): content update").slice(0, 120);

      const add = await run("git", ["add", "-A"]);
      logs.push({ step: "git_add", code: add.code, out: add.out });
      if (add.code !== 0) return NextResponse.json({ ok: false, error: "git_add_failed", logs }, { status: 500 });

      const commit = await run("git", ["commit", "-m", msg]);
      logs.push({ step: "git_commit", code: commit.code, out: commit.out });
      // Exit code 1 means "nothing to commit"
      if (commit.code !== 0 && !/nothing to commit/i.test(commit.out)) {
        return NextResponse.json({ ok: false, error: "git_commit_failed", logs }, { status: 500 });
      }

      const push = await run("git", ["push", "origin", "main"]);
      logs.push({ step: "git_push", code: push.code, out: push.out });
      if (push.code !== 0) return NextResponse.json({ ok: false, error: "git_push_failed", logs }, { status: 500 });
    }

    return NextResponse.json({ ok: true, logs, hash: nextHash });
  });

  return result;
}
