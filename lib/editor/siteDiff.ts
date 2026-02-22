import type { SiteBlock, SitePage } from "@/lib/editor/types";

export type BlockDiff = {
  added: SiteBlock[];
  removed: SiteBlock[];
  modified: { before: SiteBlock; after: SiteBlock }[];
  moved: boolean;
};

export type PageDiff = {
  pageId: string;
  kind: "page" | "global";
  slug: string;
  title: string;
  visible: boolean;
  changed: boolean;
  blocks: BlockDiff;
};

function isObject(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (isObject(a) && isObject(b)) {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    // Order-independent compare
    ak.sort();
    bk.sort();
    for (let i = 0; i < ak.length; i++) if (ak[i] !== bk[i]) return false;
    for (const k of ak) if (!deepEqual(a[k], b[k])) return false;
    return true;
  }
  return false;
}

function stripPageForDiff(p: SitePage) {
  const cloned = { ...p } as Record<string, unknown>;
  delete cloned.updatedAt;
  return cloned;
}

export function diffBlocks(draft: SiteBlock[], published: SiteBlock[]): BlockDiff {
  const draftById = new Map(draft.map((b) => [b.id, b] as const));
  const pubById = new Map(published.map((b) => [b.id, b] as const));

  const added: SiteBlock[] = [];
  const removed: SiteBlock[] = [];
  const modified: { before: SiteBlock; after: SiteBlock }[] = [];

  for (const b of draft) {
    const prev = pubById.get(b.id);
    if (!prev) {
      added.push(b);
      continue;
    }
    if (!deepEqual(b, prev)) modified.push({ before: prev, after: b });
  }
  for (const b of published) {
    if (!draftById.has(b.id)) removed.push(b);
  }

  const sharedIdsDraft = draft.map((b) => b.id).filter((id) => pubById.has(id));
  const sharedIdsPub = published.map((b) => b.id).filter((id) => draftById.has(id));
  const moved = sharedIdsDraft.length === sharedIdsPub.length && sharedIdsDraft.join("|") !== sharedIdsPub.join("|");

  return { added, removed, modified, moved };
}

export function diffPages(draft: SitePage[], published: SitePage[]): PageDiff[] {
  const pubById = new Map(published.map((p) => [p.id, p] as const));

  const diffs: PageDiff[] = draft.map((p) => {
    const prev = pubById.get(p.id) ?? null;
    const kind = (p.kind ?? "page") as "page" | "global";
    const blocks = diffBlocks(p.blocks ?? [], prev?.blocks ?? []);
    const changed =
      !prev ||
      !deepEqual(stripPageForDiff(p), stripPageForDiff(prev)) ||
      blocks.added.length > 0 ||
      blocks.removed.length > 0 ||
      blocks.modified.length > 0 ||
      blocks.moved;
    return {
      pageId: p.id,
      kind,
      slug: p.slug ?? "",
      title: p.title ?? p.slug ?? "Página",
      visible: p.visible !== false,
      changed,
      blocks,
    };
  });

  // Also include pages that exist in published but not in draft (deleted locally)
  const draftIds = new Set(draft.map((p) => p.id));
  for (const p of published) {
    if (draftIds.has(p.id)) continue;
    diffs.push({
      pageId: p.id,
      kind: (p.kind ?? "page") as "page" | "global",
      slug: p.slug ?? "",
      title: p.title ?? p.slug ?? "Página",
      visible: p.visible !== false,
      changed: true,
      blocks: diffBlocks([], p.blocks ?? []),
    });
  }

  return diffs;
}
