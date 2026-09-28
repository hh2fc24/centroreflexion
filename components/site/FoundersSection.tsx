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
        <section className="relative overflow-hidden border-t border-[#d8cfc0] bg-[#f8f5ee] py-16 sm:py-24">

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <MotionDiv
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-10 sm:mb-14"
                >
                    <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.22em] text-[#9f5528]">Quiénes somos</p>
                    <h2 className="crc-serif mt-3 text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.05] text-[#171713]">
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
                                className="flex h-full flex-col rounded-[8px] border border-[#d8cfc0] bg-[#fffdf8] p-6"
                            >
                            <div className="mb-6">
                                <div className="relative h-64 w-full overflow-hidden rounded-[6px] bg-white ring-1 ring-[#eee8dc]">
                                    {imageSrc === "placeholder:hugo" ? (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#f4eadf] text-center">
                                            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#171713] text-2xl font-bold text-white">
                                                HFH
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a8276]">Foto próximamente</span>
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
                                <h3 className="crc-serif text-[1.7rem] font-medium leading-tight text-[#171713]">
                                    <EditableText path={`homeFounders.profiles.${idx}.name`} ariaLabel="Nombre fundador" />
                                </h3>
                                <p className="mt-3 text-sm font-semibold leading-6 text-[#bd6f3c]">
                                    <EditableText path={`homeFounders.profiles.${idx}.role`} ariaLabel="Rol fundador" />
                                </p>
                            </div>

                            <p className="mb-8 flex-grow text-sm leading-7 text-[#55574f]">
                                <EditableText path={`homeFounders.profiles.${idx}.description`} ariaLabel="Descripción fundador" multiline />
                            </p>

                            <div className="mt-auto">
                                <EditorLink
                                    href={founder.id === "hugo" ? "/instituciones#agenda" : `${founder.href}#equipo`}
                                    className="group inline-flex items-center text-sm font-semibold text-[#171713] transition-colors hover:text-[#bd6f3c]"
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
