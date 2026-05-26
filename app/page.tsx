import { HomeCanvas } from "@/components/site/HomeCanvas";
import { readPublishedDiskState } from "@/lib/server/publishedDisk";
import { normalizePagesForStore } from "@/lib/editor/pagesStore";
import type { SitePage } from "@/lib/editor/types";

export default async function Home() {
  const { state } = await readPublishedDiskState();
  const pages = Array.isArray(state.pages)
    ? normalizePagesForStore(state.pages as SitePage[])
    : [];
  const home = pages.find((p) => p.id === "home" || p.slug === "") ?? null;
  return <HomeCanvas initialPage={home} />;
}
