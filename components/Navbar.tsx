"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/servicios" },
    { name: "Columnas", href: "/columnas" },
    { name: "Crítica", href: "/critica" },
    { name: "Conócenos", href: "/conocenos" },
    { name: "Envía tu texto", href: "/envia-tu-texto" },
    { name: "Contacto", href: "/contacto" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight text-gray-900 group">
                    <div className="relative h-20 w-20">
                        <Image
                            src="/log.png"
                            alt="Logo Centro de Reflexiones Críticas"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span>
                        Centro de Reflexiones <span className="text-gray-500 group-hover:text-blue-600 transition-colors">Críticas</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:items-center md:space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-600 hover:text-gray-900"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="space-y-1 px-4 py-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600"
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
