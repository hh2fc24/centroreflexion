import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ADMIN_USER = "Jrauld";
const ADMIN_PASS = "Jrauld.2026";

type PublishBody = {
  theme: unknown;
  content: unknown;
  articles: unknown;
  validateBuild?: boolean;
  gitCommitPush?: boolean;
  commitMessage?: string;
};

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

function decodeBasicAuth(auth: string | null) {
  if (!auth) return null;
  const m = auth.match(/^Basic (.+)$/i);
  if (!m) return null;
  try {
    const decoded = Buffer.from(m[1]!, "base64").toString("utf8");
    const [user, pass] = decoded.split(":");
    if (!user || pass == null) return null;
    return { user, pass };
  } catch {
    return null;
  }
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

  const creds = decodeBasicAuth(req.headers.get("authorization"));
  if (!creds || creds.user !== ADMIN_USER || creds.pass !== ADMIN_PASS) return unauthorized();

  let body: PublishBody;
  try {
    body = (await req.json()) as PublishBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const logs: { step: string; code?: number; out?: string }[] = [];

  try {
    const themePath = path.join(process.cwd(), "lib/editor/published-theme.json");
    const contentPath = path.join(process.cwd(), "lib/editor/published-content.json");
    const articlesPath = path.join(process.cwd(), "lib/articles.json");

    await writeFile(themePath, JSON.stringify(body.theme ?? {}, null, 2) + "\n", "utf8");
    await writeFile(contentPath, JSON.stringify(body.content ?? {}, null, 2) + "\n", "utf8");
    await writeFile(articlesPath, JSON.stringify(body.articles ?? {}, null, 2) + "\n", "utf8");
    logs.push({ step: "write_files" });
  } catch (e: unknown) {
    const detail = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
    return NextResponse.json({ ok: false, error: "write_failed", detail, logs }, { status: 500 });
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

  return NextResponse.json({ ok: true, logs });
}
