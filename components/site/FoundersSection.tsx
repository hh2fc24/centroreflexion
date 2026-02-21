"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MotionDiv } from "@/components/ui/Motion";
import { EditorLink } from "@/components/editor/EditorLink";
import { EditableText } from "@/components/editor/EditableText";
import { useContent } from "@/lib/editor/hooks";

export function FoundersSection() {
    const { content } = useContent();
    const founders = content.homeFounders?.profiles || [];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-50 to-white pointer-events-none" />
            <div className="absolute -left-40 top-20 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute -right-40 bottom-20 w-96 h-96 bg-red-50/50 rounded-full blur-3xl opacity-50 pointer-events-none" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
                        <EditableText path="homeFounders.title" ariaLabel="Título de fundadores" />
                    </h2>
                </MotionDiv>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {founders.map((founder, idx) => (
                        <MotionDiv
                            key={founder.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                                <div className="h-40 w-40 shrink-0 rounded-2xl bg-gray-100 relative overflow-hidden shadow-inner">
                                    <Image
                                        src={founder.imageSrc}
                                        alt={founder.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                <div className="text-center sm:text-left flex-1 pt-2">
                                    <h3 className="text-2xl font-bold text-gray-900 font-serif mb-2">
                                        <EditableText path={`homeFounders.profiles.${idx}.name`} ariaLabel="Nombre fundador" />
                                    </h3>
                                    <p className={`text-sm font-bold uppercase tracking-wide mb-4 ${idx === 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                        <EditableText path={`homeFounders.profiles.${idx}.role`} ariaLabel="Rol fundador" />
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed flex-grow text-center sm:text-left mb-8">
                                <EditableText path={`homeFounders.profiles.${idx}.description`} ariaLabel="Descripción fundador" multiline />
                            </p>

                            <div className="mt-auto text-center sm:text-left">
                                <EditorLink
                                    href={founder.href}
                                    className={`inline-flex items-center font-semibold group transition-colors ${idx === 0 ? 'text-blue-600 hover:text-blue-700' : 'text-red-600 hover:text-red-700'}`}
                                >
                                    Conocer más
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </EditorLink>
                            </div>
                        </MotionDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}
