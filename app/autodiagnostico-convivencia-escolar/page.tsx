import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { AltiusLogo } from "@/components/altius/AltiusLogo";
import { Autodiagnostico } from "./Autodiagnostico";

export const metadata: Metadata = pageMetadata({
    title: "Autodiagnóstico de convivencia escolar · Ley 21.809",
    description:
        "Doce preguntas para que un equipo directivo vea dónde está su colegio frente a la Ley 21.809: responsables, protocolos, registro y trazabilidad, equipo y familias. Gratuito y sin registro.",
    path: "/autodiagnostico-convivencia-escolar",
});

export default function AutodiagnosticoPage() {
    return (
        <div className="bg-[#f8f5ee] text-[#171713]">
            <div className="mx-auto max-w-[1040px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
                <p className="text-[0.8125rem] font-semibold text-[#9f5528]">Compliance escolar · Ley 21.809</p>
                <h1 className="crc-serif mt-4 max-w-[24ch] text-balance text-[clamp(2rem,3.2vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em]">
                    Autodiagnóstico de convivencia escolar
                </h1>
                <p className="mt-6 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-[#55574f]">
                    Doce preguntas para equipos directivos y encargados de convivencia. Al final verás en qué áreas el colegio
                    podría demostrar una gestión diligente y dónde están las brechas. Gratuito, sin registro y sin enviar datos.
                </p>
                <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.875rem] text-[#6f675d]">
                    Una herramienta del{" "}
                    <Link href="/laboratorio" className="font-semibold text-[#171713] underline decoration-[#bd6f3c] underline-offset-4">
                        Laboratorio CRC × Altius
                    </Link>
                    <AltiusLogo showWordmark={false} className="text-[0.75rem] text-[#6f675d]" />
                </p>

                <div className="mt-10">
                    <Autodiagnostico />
                </div>
            </div>
        </div>
    );
}
