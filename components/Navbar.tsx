"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Conócenos", href: "/conocenos" },
    { name: "Pensamiento Crítico", href: "/pensamiento-critico" },
    { name: "Publicaciones", href: "/publicaciones" },
    { name: "Clínica", href: "/servicios#clinica" },
    { name: "Consultoría", href: "/servicios#consultoria" },
    { name: "Formación", href: "/servicios#formacion" },
    { name: "Contacto", href: "/contacto" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative text-sm font-semibold text-muted-foreground transition-all duration-300 hover:scale-105 hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:after:w-full"
                        >
                            {item.name}
                        </Link>
                    ))}
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
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-base font-medium text-muted-foreground hover:bg-black/5 hover:text-primary"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
