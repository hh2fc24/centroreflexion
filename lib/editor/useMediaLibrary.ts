"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MediaItem } from "@/lib/editor/mediaClient";
import { deleteMedia, listMedia, uploadMedia } from "@/lib/editor/mediaClient";

export function useMediaLibrary({ autoLoad = true }: { autoLoad?: boolean } = {}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const next = await listMedia();
      setItems(next);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      setError(message);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (!autoLoad) return;
    reload();
  }, [autoLoad, reload]);

  const upload = useCallback(async (file: File) => {
    setUploadBusy(true);
    setError(null);
    try {
      const item = await uploadMedia(file);
      setItems((cur) => [item, ...cur]);
      return item;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
      setError(message);
      throw e;
    } finally {
      setUploadBusy(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setError(null);
    await deleteMedia(id);
    setItems((cur) => cur.filter((x) => x.id !== id));
  }, []);

  const recent = useMemo(() => items.slice(0, 8), [items]);

  return {
    items,
    recent,
    busy,
    uploadBusy,
    error,
    setError,
    reload,
    upload,
    remove,
  } as const;
}

