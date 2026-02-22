"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function SafeImage({
  src,
  alt,
  fill,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}) {
  const isLocal = typeof src === "string" && src.startsWith("/");

  if (!isLocal) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={cn(className)} loading="lazy" />;
  }

  return <Image src={src} alt={alt} fill={fill} sizes={sizes} className={cn(className)} />;
}

