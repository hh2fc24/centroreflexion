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

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                    {founders.map((founder, idx) => {
                        const imageSrc = founder.id === "rocio" ? "/images/rocio-solar-crc-2026.png" : founder.imageSrc;

                        return (
                            <MotionDiv
                                key={founder.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.2 }}
                                className="flex h-full flex-col rounded-[8px] border border-gray-100 bg-white p-6 shadow-lg shadow-gray-200/40 transition-transform duration-300 hover:-translate-y-1"
                            >
                            <div className="mb-6">
                                <div className="relative h-64 w-full overflow-hidden rounded-[8px] bg-white shadow-inner ring-1 ring-gray-100">
                                    {imageSrc === "placeholder:hugo" ? (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#f4eadf] text-center">
                                            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#171713] text-2xl font-bold text-white">
                                                HFH
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a8276]">Foto próximamente</span>
                                        </div>
                                    ) : imageSrc === "/images/hugo_hormazabal.png" ? (
                                        <Image
                                            src={imageSrc}
                                            alt={founder.name}
                                            width={640}
                                            height={900}
                                            className="h-full w-full object-contain object-center bg-white"
                                        />
                                    ) : (
                                        <Image
                                            src={imageSrc}
                                            alt={founder.name}
                                            width={640}
                                            height={900}
                                            className="h-full w-full object-contain object-center bg-white"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="mb-5">
                                <h3 className="text-2xl font-bold leading-tight text-gray-900 font-serif">
                                    <EditableText path={`homeFounders.profiles.${idx}.name`} ariaLabel="Nombre fundador" />
                                </h3>
                                <p className="mt-3 text-sm font-semibold leading-6 text-[#bd6f3c]">
                                    <EditableText path={`homeFounders.profiles.${idx}.role`} ariaLabel="Rol fundador" />
                                </p>
                            </div>

                            <p className="mb-8 flex-grow text-sm leading-7 text-gray-600">
                                <EditableText path={`homeFounders.profiles.${idx}.description`} ariaLabel="Descripción fundador" multiline />
                            </p>

                            <div className="mt-auto">
                                <EditorLink
                                    href={`${founder.href}#equipo`}
                                    className="group inline-flex items-center text-sm font-semibold text-gray-900 transition-colors hover:text-[#bd6f3c]"
                                >
                                    Conocer más
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </EditorLink>
                            </div>
                        </MotionDiv>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
