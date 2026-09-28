"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Aparición sutil al entrar en pantalla, una sola vez (opacidad y 12px, 0.55 s).
 * El HTML del servidor se ve completo: solo se oculta en el cliente lo que aún
 * está bajo el pliegue y solo si la persona no pidió menos movimiento.
 */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof window === "undefined" || !("IntersectionObserver" in window)) return;
        if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

        el.style.opacity = "0";
        el.style.transform = "translateY(12px)";

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                el.style.transition = `opacity 0.55s ease-out ${delay}s, transform 0.55s ease-out ${delay}s`;
                el.style.opacity = "1";
                el.style.transform = "none";
                observer.disconnect();
            },
            { rootMargin: "0px 0px -8% 0px" }
        );
        observer.observe(el);

        return () => {
            observer.disconnect();
            el.style.opacity = "";
            el.style.transform = "";
        };
    }, [delay]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
