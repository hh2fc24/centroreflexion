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
        <section className="border-t border-[#d8cfc0] bg-[#f8f5ee] py-16 sm:py-24">

            <div className="mx-auto max-w-[1640px] px-5 sm:px-8 lg:px-14 xl:px-20">
                <MotionDiv
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="mb-10 sm:mb-14"
                >
                    <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Quiénes somos</p>
                    <h2 className="crc-serif mt-3 text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.01em] text-[#171713] text-balance">
                        <EditableText path="homeFounders.title" ariaLabel="Título de fundadores" />
                    </h2>
                </MotionDiv>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                    {founders.map((founder, idx) => {
                        const imageSrc = founder.id === "rocio" ? "/images/rocio-solar-crc-2026.png" : founder.imageSrc;

                        return (
                            <MotionDiv
                                key={founder.id}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: idx * 0.08 }}
                                className="flex h-full flex-col rounded-[6px] border border-[#d8cfc0] bg-[#fffdf8] p-6"
                            >
                            <div className="mb-6">
                                <div className="relative h-64 w-full overflow-hidden rounded-[6px] bg-white ring-1 ring-[#eee8dc]">
                                    {imageSrc === "placeholder:hugo" ? (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#eee8dc] text-center">
                                            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-[6px] bg-[#171713] text-[1.35rem] font-semibold text-white">
                                                HFH
                                            </div>
                                            <span className="text-[0.8125rem] font-semibold text-[#6f675d]">Foto próximamente</span>
                                        </div>
                                    ) : imageSrc === "/images/hugo-hormazabal-crc-2026-large.png" ? (
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
                                <h3 className="crc-serif text-[1.5rem] font-medium leading-[1.15] text-[#171713]">
                                    <EditableText path={`homeFounders.profiles.${idx}.name`} ariaLabel="Nombre fundador" />
                                </h3>
                                <p className="mt-2 text-[0.875rem] font-semibold leading-snug text-[#9f5528]">
                                    <EditableText path={`homeFounders.profiles.${idx}.role`} ariaLabel="Rol fundador" />
                                </p>
                            </div>

                            <p className="mb-8 flex-grow text-[0.9375rem] leading-[1.7] text-[#55574f]">
                                <EditableText path={`homeFounders.profiles.${idx}.description`} ariaLabel="Descripción fundador" multiline />
                            </p>

                            <div className="mt-auto">
                                <EditorLink
                                    href={founder.id === "hugo" ? "/instituciones#agenda" : `${founder.href}#equipo`}
                                    className="group inline-flex items-center text-[0.9375rem] font-semibold text-[#171713] transition-colors hover:text-[#9f5528]"
                                >
                                    {founder.id === "hugo" ? "Agenda 20 minutos con Hugo" : "Conocer más"}
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
