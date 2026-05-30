"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useContent, useEditor } from "@/lib/editor/hooks";
import type { NavigationContent } from "@/lib/editor/types";
import { cn } from "@/lib/utils";

type NavNode = { id: string; label: string; href: string; visible: boolean; children: NavNode[] };

export function Navbar({ initialNavigation }: { initialNavigation?: NavigationContent }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { content } = useContent();
    const { adminEnabled } = useEditor();

    const sourceNavigation =
        adminEnabled
            ? content.navigation
            : content.navigation?.items?.length
                ? content.navigation
                : initialNavigation;

    const items: NavNode[] = (sourceNavigation?.items ?? []) as unknown as NavNode[];
    const visibleItems = items.filter((i) => i.visible !== false);

    const maybePrevent = (e: React.MouseEvent) => {
        if (!adminEnabled) return;
        e.preventDefault();
        e.stopPropagation();
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav data-main-nav="" className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            scrolled
                ? "bg-[#f8f5ee]/96 shadow-[0_1px_18px_rgba(31,27,22,0.08)] backdrop-blur"
                : "bg-[#f8f5ee]"
        )}>
            <div className="mx-auto flex h-[70px] max-w-[1640px] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12">

                <Link href="/" className="group flex min-w-0 shrink-0 items-center">
                    <Image
                        src="/logo-crc.png"
                        alt="Centro de Reflexiones Críticas"
                        width={64}
                        height={64}
                        priority
                        className="h-14 w-14 object-contain sm:h-16 sm:w-16"
                    />
                </Link>

                <div className="hidden items-center gap-1 min-[1180px]:flex">
                    {visibleItems.map((item) => {
                        const hasChildren = (item.children ?? []).some((c) => c.visible !== false);
                        return (
                            <div key={item.id} className="relative group">
                                <Link
                                    href={item.href}
                                    onClick={maybePrevent}
                                    className="relative block whitespace-nowrap px-2.5 py-3 text-[0.66rem] font-extrabold uppercase tracking-[0.13em] text-[#363832] transition-colors duration-150 hover:text-[#bd6f3c] xl:px-3.5 xl:text-[0.72rem] xl:tracking-[0.16em]"
                                >
                                    {item.label}
                                    <span className="absolute bottom-1 left-2.5 right-2.5 h-0.5 origin-left scale-x-0 bg-[#bd6f3c] transition-transform duration-200 group-hover:scale-x-100 xl:left-3.5 xl:right-3.5" />
                                </Link>
                                {hasChildren ? (
                                    <div className="absolute left-0 top-full pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150">
                                        <div className="w-max min-w-44 border border-[#d8cfc0] bg-[#f8f5ee] shadow-[0_14px_38px_rgba(31,27,22,0.13)]">
                                            {(item.children ?? [])
                                                .filter((c) => c.visible !== false)
                                                .map((c) => (
                                                    <Link
                                                        key={c.id}
                                                        href={c.href}
                                                        onClick={(e) => { maybePrevent(e); }}
                                                        className={cn(
                                                            "block whitespace-nowrap px-4 py-3 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-[#4b4d46]",
                                                            "border-b border-[#d8cfc0]/70 transition-colors last:border-b-0 hover:bg-[#eee8dc] hover:text-[#171713]"
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

                    <Link
                        href="/contacto"
                        className="ml-3 inline-flex h-10 items-center gap-3 rounded-[6px] bg-[#172017] px-5 text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_12px_24px_rgba(23,32,23,0.16)] transition duration-200 hover:bg-[#233122] xl:ml-5 xl:gap-4 xl:px-6"
                    >
                        Agendar Atención
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <button
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[5px] border border-[#d8cfc0] text-[#363832] transition-colors hover:text-[#171713] min-[1180px]:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {isOpen && (
                <div className="border-t border-[#d8cfc0] bg-[#f8f5ee] min-[1180px]:hidden">
                    <div className="px-5 py-3">
                        {visibleItems.map((item) => {
                            const kids = (item.children ?? []).filter((c) => c.visible !== false);
                            return (
                                <div key={item.id}>
                                    <Link
                                        href={item.href}
                                        onClick={(e) => {
                                            if (adminEnabled) { maybePrevent(e); return; }
                                            setIsOpen(false);
                                        }}
                                        className="block border-b border-[#d8cfc0]/70 py-3 text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-[#363832] transition-colors hover:text-[#bd6f3c]"
                                    >
                                        {item.label}
                                    </Link>
                                    {kids.length ? (
                                        <div className="pl-3">
                                            {kids.map((c) => (
                                                <Link
                                                    key={c.id}
                                                    href={c.href}
                                                    onClick={(e) => {
                                                        if (adminEnabled) { maybePrevent(e); return; }
                                                        setIsOpen(false);
                                                    }}
                                                    className="block border-b border-[#d8cfc0]/50 py-2.5 text-[0.68rem] font-extrabold uppercase tracking-[0.13em] text-[#6d665a] transition-colors hover:text-[#bd6f3c]"
                                                >
                                                    {c.label}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                        <div className="py-3">
                            <Link
                                href="/contacto"
                                onClick={() => setIsOpen(false)}
                                className="block rounded-[5px] bg-[#172017] px-4 py-3 text-center text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#233122]"
                            >
                                Agendar Atención →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
