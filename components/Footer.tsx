"use client";

import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, MessageCircle } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { useContent, useEditor } from "@/lib/editor/hooks";
import type { FooterColumn, FooterContent, FooterLink } from "@/lib/editor/types";

export function Footer({ initialFooter }: { initialFooter?: FooterContent }) {
    const { adminEnabled } = useEditor();
    const { content, get } = useContent();

    const footer = adminEnabled ? content.footer : initialFooter ?? content.footer;

    const instagramHref = footer?.instagramHref || get<string>("footer.instagramHref") || "#";
    const linkedinHref = footer?.linkedinHref || get<string>("footer.linkedinHref") || "#";
    const whatsappHref = footer?.whatsappHref || get<string>("footer.whatsappHref") || "#";
    const columns = (footer?.columns ?? get<FooterColumn[]>("footer.columns") ?? []) as FooterColumn[];

    return (
        <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">
                            <EditableText path="footer.brandTitle" ariaLabel="Footer marca" />{" "}
                            <span className="text-red-500">
                                <EditableText path="footer.brandHighlight" ariaLabel="Footer marca destacado" />
                            </span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            <EditableText path="footer.description" ariaLabel="Footer descripción" multiline />
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href={instagramHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-pink-500 transition-colors"
                                onClick={(e) => {
                                    if (adminEnabled) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                }}
                            >
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a
                                href={linkedinHref}
                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                onClick={(e) => {
                                    if (adminEnabled) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                }}
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-emerald-400 transition-colors"
                                onClick={(e) => {
                                    if (adminEnabled) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }
                                }}
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span className="sr-only">WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* Dynamic Columns */}
                    {columns
                        .filter((c) => c?.visible !== false)
                        .map((col, colIdx) => (
                            <div key={col.id || colIdx}>
                                <h4 className="text-white font-semibold mb-4">
                                    <EditableText path={`footer.columns.${colIdx}.title`} ariaLabel="Footer columna" />
                                </h4>
                                <ul className="space-y-3 text-sm text-gray-400">
                                    {(col.links ?? [])
                                        .filter((l: FooterLink) => l?.visible !== false)
                                        .map((l: FooterLink, linkIdx: number) => (
                                            <li key={l.id || linkIdx}>
                                                <Link
                                                    href={l.href || "#"}
                                                    onClick={(e) => {
                                                        if (adminEnabled) {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }
                                                    }}
                                                    className="hover:text-white transition-colors"
                                                >
                                                    <EditableText
                                                        path={`footer.columns.${colIdx}.links.${linkIdx}.label`}
                                                        ariaLabel="Footer link"
                                                    />
                                                </Link>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        ))}

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start">
                                <Mail className="h-5 w-5 mr-3 text-red-500 flex-shrink-0" />
                                <span className="break-all sm:break-normal">
                                    <Link href="/contacto" className="hover:text-amber-500 transition-colors">
                                        <EditableText path="footer.contactEmail" ariaLabel="Footer email" />
                                    </Link>
                                </span>
                            </li>
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                                <span>
                                    <EditableText path="footer.contactLocation" ariaLabel="Footer ubicación" />
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col items-center justify-center">
                    <p className="text-xs text-gray-500 text-center">
                        &copy; {new Date().getFullYear()}{" "}
                        <EditableText path="footer.copyrightName" ariaLabel="Footer copyright" />. Todos los derechos
                        reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
