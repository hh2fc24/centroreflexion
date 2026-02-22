"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useContent, useEditor, useTheme } from "@/lib/editor/hooks";

type EditableTextProps = {
  path: string;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  ariaLabel?: string;
};

export function EditableText({
  path,
  className,
  multiline = false,
  placeholder,
  ariaLabel,
}: EditableTextProps) {
  const { adminEnabled, selectText } = useEditor();
  const { get, set } = useContent();
  const { theme } = useTheme();
  const value = (get<string>(path) ?? "") as string;

  const elRef = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [draft, setDraft] = useState("");

  const commit = useCallback(() => {
    const next = draft.trimEnd();
    set(path, next);
  }, [draft, path, set]);

  const onActivate = useCallback(() => {
    if (!adminEnabled) return;
    selectText(path);
    setDraft(value);
    setIsActive(true);
    queueMicrotask(() => {
      const el = elRef.current;
      if (!el) return;
      el.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    });
  }, [adminEnabled, path, selectText, value]);

  const override = theme.textStyles?.[path] ?? {};

  const displayText = useMemo(() => {
    if (!adminEnabled) return value;
    if (isActive) return draft;
    return value || "";
  }, [adminEnabled, draft, isActive, value]);

  return (
    <span
      ref={(node) => {
        elRef.current = node;
      }}
      role={adminEnabled ? "textbox" : undefined}
      aria-label={ariaLabel}
      contentEditable={adminEnabled && isActive}
      suppressContentEditableWarning
      tabIndex={adminEnabled ? 0 : -1}
      onClick={onActivate}
      onFocus={onActivate}
      onBlur={() => {
        if (!adminEnabled) return;
        setIsActive(false);
        commit();
      }}
      onKeyDown={(e) => {
        if (!adminEnabled) return;
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setDraft(value);
          (e.currentTarget as HTMLElement).blur();
        }
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      onInput={(e) => {
        if (!adminEnabled) return;
        const next = (e.currentTarget.textContent ?? "").replace(/\u00A0/g, " ");
        setDraft(next);
      }}
      className={cn(
        adminEnabled &&
          "rounded-md outline-none ring-1 ring-transparent hover:ring-[color:var(--primary)]/30 focus:ring-[color:var(--primary)]/50 transition-colors cursor-text",
        isActive && "ring-[color:var(--primary)]/60 bg-[color:color-mix(in_oklab,var(--surface)_85%,transparent)]",
        !displayText && placeholder && adminEnabled && "text-[color:var(--muted-foreground)]",
        multiline && "whitespace-pre-wrap",
        className
      )}
      style={{
        color: override.color,
        fontFamily:
          override.font === "geist"
            ? "var(--font-geist)"
            : override.font === "merriweather"
              ? "var(--font-merriweather)"
              : override.font === "inter"
                ? "var(--font-inter)"
                : undefined,
        fontSize: override.fontSizePx ? `${override.fontSizePx}px` : undefined,
        fontWeight: override.fontWeight,
      }}
      data-crc-editable={adminEnabled ? "true" : undefined}
      data-crc-path={path}
    >
      {displayText || placeholder || ""}
    </span>
  );
}
