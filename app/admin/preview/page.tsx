import { PreviewClient } from "@/components/admin/PreviewClient";
import { VersionPreviewClient } from "@/components/admin/VersionPreviewClient";

export default function PreviewPage({ searchParams }: { searchParams: { pageId?: string; versionId?: string } }) {
  const pageId = searchParams.pageId ?? "";
  const versionId = searchParams.versionId ?? "";
  if (versionId) return <VersionPreviewClient pageId={pageId} versionId={versionId} />;
  return <PreviewClient pageId={pageId} />;
}
