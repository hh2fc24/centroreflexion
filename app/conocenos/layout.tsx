import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conócenos",
    description:
        "Conoce al equipo fundador del Centro de Reflexiones Críticas: trayectoria en salud mental, infancia, trabajo social y consultoría institucional.",
    openGraph: {
        title: "Conócenos | Centro de Reflexiones Críticas",
        description: "El equipo y la trayectoria detrás del Centro de Reflexiones Críticas.",
    },
};

export default function ConocenosLayout({ children }: { children: React.ReactNode }) {
    return children;
}
