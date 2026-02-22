"use client";

import { useEffect } from "react";
import { useEditor } from "@/lib/editor/hooks";
import { HomeCanvas } from "@/components/site/HomeCanvas";
import { PageCanvas } from "@/components/site/PageCanvas";

export function PreviewClient({ pageId }: { pageId: string }) {
  const { setAdminEnabled } = useEditor();

  useEffect(() => {
    // Force preview to behave like the public site (no chrome/editing), while still using draft state.
    setAdminEnabled(false);
  }, [setAdminEnabled]);

  if (pageId && pageId !== "home") return <PageCanvas pageId={pageId} />;
  return <HomeCanvas />;
}

