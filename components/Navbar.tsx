"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useContent, useEditor } from "@/lib/editor/hooks";
import { cn } from "@/lib/utils";

type NavNode = { id: string; label: string; href: string; visible: boolean; children: NavNode[] };

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { content } = useContent();
    const { adminEnabled } = useEditor();

    const items: NavNode[] =
        (content.navigation?.items?.length ? content.navigation.items : []) as unknown as NavNode[];

    const visibleItems = items.filter((i) => i.visible !== false);

    const maybePrevent = (e: React.MouseEvent) => {
        if (!adminEnabled) return;
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm transition-all duration-300">
            <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight text-foreground group">
                    <div className="relative h-24 w-24 -ml-2">
                        <Image
                            src="/log.png"
                            alt="Logo Centro de Reflexiones Críticas"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span>
                        Centro de Reflexiones <span className="text-red-600 group-hover:text-red-500 transition-colors">Críticas</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:items-center md:space-x-8">
                    {visibleItems.map((item) => {
                        const hasChildren = (item.children ?? []).some((c) => c.visible !== false);
                        return (
                            <div key={item.id} className="relative group">
                                <Link
                                    href={item.href}
                                    onClick={maybePrevent}
                                    className="relative text-sm font-semibold text-muted-foreground transition-all duration-300 hover:scale-105 hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    {item.label}
                                </Link>
                                {hasChildren ? (
                                    <div className="absolute left-0 top-full pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition">
                                        <div className="min-w-56 rounded-2xl border border-border bg-background shadow-lg overflow-hidden">
                                            {(item.children ?? [])
                                                .filter((c) => c.visible !== false)
                                                .map((c) => (
                                                    <Link
                                                        key={c.id}
                                                        href={c.href}
                                                        onClick={(e) => {
                                                            maybePrevent(e);
                                                        }}
                                                        className={cn(
                                                            "block px-4 py-3 text-sm font-semibold text-muted-foreground",
                                                            "hover:bg-black/5 hover:text-primary transition-colors"
                                                        )}
                                                    >
                                                        {c.label}
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-muted-foreground hover:text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-border bg-background">
                    <div className="space-y-1 px-4 py-4">
                        {visibleItems.map((item) => {
                            const kids = (item.children ?? []).filter((c) => c.visible !== false);
                            return (
                                <div key={item.id} className="rounded-xl border border-transparent hover:border-border/60 transition">
                                    <Link
                                        href={item.href}
                                        onClick={(e) => {
                                            if (adminEnabled) {
                                                maybePrevent(e);
                                                return;
                                            }
                                            setIsOpen(false);
                                        }}
                                        className="block py-2 text-base font-semibold text-muted-foreground hover:bg-black/5 hover:text-primary rounded-xl px-2"
                                    >
                                        {item.label}
                                    </Link>
                                    {kids.length ? (
                                        <div className="pl-3 pb-2">
                                            {kids.map((c) => (
                                                <Link
                                                    key={c.id}
                                                    href={c.href}
                                                    onClick={(e) => {
                                                        if (adminEnabled) {
                                                            maybePrevent(e);
                                                            return;
                                                        }
                                                        setIsOpen(false);
                                                    }}
                                                    className="block py-2 text-sm font-semibold text-muted-foreground hover:bg-black/5 hover:text-primary rounded-xl px-2"
                                                >
                                                    {c.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
