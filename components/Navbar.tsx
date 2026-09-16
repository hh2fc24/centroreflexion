"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { useContent, useEditor } from "@/lib/editor/hooks";
import type { NavigationContent } from "@/lib/editor/types";
import { cn } from "@/lib/utils";

type NavNode = { id: string; label: string; href: string; visible: boolean; description?: string; children: NavNode[] };

export function Navbar({ initialNavigation }: { initialNavigation?: NavigationContent }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { content } = useContent();
    const { adminEnabled } = useEditor();

    const sourceNavigation =
        adminEnabled
            ? content.navigation
            : content.navigation?.items?.length
                ? content.navigation
                : initialNavigation;

    const items: NavNode[] = (sourceNavigation?.items ?? []) as unknown as NavNode[];
    const visibleItems = items.filter((i) => (
        i.visible !== false &&
        i.href !== "/contacto" &&
        i.label.toLocaleLowerCase("es-CL") !== "contacto"
    ));

    // Un ítem padre puede ser prefijo de otro (/servicios vs /servicios/clinica),
    // así que gana el match más específico y solo se marca activo uno.
    const matchLength = (href: string) => {
        const clean = (href ?? "").split("#")[0];
        if (!clean) return -1;
        if (clean === "/") return pathname === "/" ? 0 : -1;
        return pathname === clean || pathname.startsWith(`${clean}/`) ? clean.length : -1;
    };

    let activeId: string | null = null;
    let bestMatch = -1;
    for (const item of visibleItems) {
        for (const href of [item.href, ...(item.children ?? []).map((c) => c.href)]) {
            const length = matchLength(href);
            if (length > bestMatch) {
                bestMatch = length;
                activeId = item.id;
            }
        }
    }

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
            "sticky top-0 z-50 w-full border-b transition-all duration-300",
            scrolled
                ? "border-[#d8cfc0]/70 bg-[#f8f5ee]/94 shadow-[0_10px_34px_rgba(31,27,22,0.08)] backdrop-blur-xl"
                : "border-[#d8cfc0]/45 bg-[#f8f5ee]/98"
        )}>
            <div className="mx-auto flex h-[72px] max-w-[1680px] items-center justify-between gap-4 px-5 sm:h-[82px] sm:px-8 lg:px-12">

                <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-3">
                    <Image
                        src="/logo-crc.png"
                        alt="Centro de Reflexiones Críticas"
                        width={64}
                        height={64}
                        priority
                        className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                    />
                    <span className="hidden min-w-0 text-[#171713] sm:block">
                        <span className="block font-serif text-xl font-semibold leading-none min-[1500px]:hidden">CRC</span>
                        <span className="hidden font-serif text-[1.05rem] font-semibold leading-tight min-[1500px]:block">
                            Centro de Reflexiones Críticas
                        </span>
                    </span>
                </Link>

                <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 min-[1240px]:flex">
                    <div className="flex min-w-0 items-center justify-center gap-1">
                    {visibleItems.map((item) => {
                        const hasChildren = (item.children ?? []).some((c) => c.visible !== false);
                        const active = item.id === activeId;
                        return (
                            <div key={item.id} className="relative group">
                                <Link
                                    href={item.href}
                                    onClick={maybePrevent}
                                    className={cn(
                                        "inline-flex h-10 items-center whitespace-nowrap rounded-[7px] px-3 text-sm font-semibold text-[#414038] transition duration-150 xl:px-3.5",
                                        active
                                            ? "bg-[#ede6d9] text-[#171713]"
                                            : "hover:bg-[#efe9df] hover:text-[#171713]"
                                    )}
                                >
                                    {item.label}
                                    {active ? (
                                        <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#bd6f3c]" />
                                    ) : null}
                                </Link>
                                {hasChildren ? (
                                    <div className="pointer-events-none absolute left-0 top-full pt-3 opacity-0 transition duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                                        <div className="w-[21rem] rounded-[8px] border border-[#d8cfc0]/80 bg-[#fffdf8] p-1.5 shadow-[0_18px_46px_rgba(31,27,22,0.15)]">
                                            {(item.children ?? [])
                                                .filter((c) => c.visible !== false)
                                                .map((c) => (
                                                    <Link
                                                        key={c.id}
                                                        href={c.href}
                                                        onClick={(e) => { maybePrevent(e); }}
                                                        className="block rounded-[6px] px-3.5 py-2.5 transition-colors hover:bg-[#eee8dc]"
                                                    >
                                                        <span className="block text-sm font-semibold text-[#2b2d27]">{c.label}</span>
                                                        {c.description ? (
                                                            <span className="mt-0.5 block text-xs leading-5 text-[#77716a]">{c.description}</span>
                                                        ) : null}
                                                    </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                    </div>

                    <Link
                        href="/contacto"
                        className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-[8px] bg-[#172017] px-5 text-sm font-semibold text-[#fffdf8] shadow-[0_14px_34px_rgba(23,32,23,0.18)] transition duration-200 hover:bg-[#243323] hover:shadow-[0_18px_44px_rgba(23,32,23,0.22)] xl:px-6"
                    >
                        Da el primer paso
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <button
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#d8cfc0] bg-[#fffdf8]/70 text-[#363832] transition-colors hover:text-[#171713] min-[1240px]:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {isOpen && (
                <div className="border-t border-[#d8cfc0]/70 bg-[#f8f5ee] min-[1240px]:hidden">
                    <div className="px-5 py-4">
                        <Link
                            href="/contacto"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#172017] px-4 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#233122]"
                        >
                            Da el primer paso
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a
                            href="tel:*4141"
                            onClick={() => setIsOpen(false)}
                            className="mt-2 flex items-center justify-center gap-2 rounded-[8px] border border-[#d9a066]/50 bg-[#f6ead9] px-4 py-3 text-sm font-semibold text-[#8a4f20]"
                        >
                            <Phone className="h-4 w-4" />
                            ¿En crisis ahora? Llama al *4141
                        </a>

                        <div className="mt-4 border-t border-[#d8cfc0]/70 pt-1">
                        {visibleItems.map((item) => {
                            const kids = (item.children ?? []).filter((c) => c.visible !== false);
                            const active = item.id === activeId;
                            return (
                                <div key={item.id}>
                                    <Link
                                        href={item.href}
                                        onClick={(e) => {
                                            if (adminEnabled) { maybePrevent(e); return; }
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "block border-b border-[#d8cfc0]/65 py-3 text-base font-semibold transition-colors hover:text-[#bd6f3c]",
                                            active ? "text-[#171713]" : "text-[#363832]"
                                        )}
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
                                                    className="block border-b border-[#d8cfc0]/50 py-2.5 transition-colors hover:text-[#bd6f3c]"
                                                >
                                                    <span className="block text-sm font-medium text-[#6d665a]">{c.label}</span>
                                                    {c.description ? (
                                                        <span className="mt-0.5 block text-xs leading-5 text-[#918a80]">{c.description}</span>
                                                    ) : null}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
