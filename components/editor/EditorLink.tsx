"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useEditor } from "@/lib/editor/hooks";

type EditorLinkProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

export function EditorLink({ children, ...props }: EditorLinkProps) {
  const { adminEnabled } = useEditor();

  return (
    <Link
      {...props}
      onClick={(e) => {
        if (adminEnabled) {
          e.preventDefault();
          e.stopPropagation();
        }
        props.onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
