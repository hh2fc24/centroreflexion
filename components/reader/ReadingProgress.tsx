"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Barra fina de progreso de lectura, arriba de la ventana.
 *
 * Mide el avance sobre el elemento que contiene el texto (no sobre toda la
 * página), así llega al 100 % al terminar la columna y no al final del footer.
 * Escribe el ancho directo en el DOM para no re-renderizar en cada scroll.
 */
export function ReadingProgress({ target }: { target: RefObject<HTMLElement | null> }) {
    const bar = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const el = target.current;
            const fill = bar.current;
            if (!el || !fill) return;
            const rect = el.getBoundingClientRect();
            const total = rect.height - window.innerHeight;
            const read = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
            fill.style.transform = `scaleX(${read})`;
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [target]);

    return (
        <div aria-hidden="true" data-print-hide="" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
            <div ref={bar} className="h-full origin-left bg-[#bd6f3c]" style={{ transform: "scaleX(0)" }} />
        </div>
    );
}
