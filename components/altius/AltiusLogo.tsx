import { cn } from "@/lib/utils";

/**
 * Logo de Altius Ignite en vector y en un solo color (hereda `currentColor`).
 * Reemplaza al PNG de 194×152 con fondo negro y azul propio, que se veía
 * recortado sobre las bandas del CRC. Sirve sobre fondo claro y oscuro.
 */
export function AltiusLogo({
    className,
    showWordmark = true,
    title = "Altius Ignite",
}: {
    className?: string;
    showWordmark?: boolean;
    title?: string;
}) {
    return (
        <span className={cn("inline-flex items-center gap-2.5", className)} role="img" aria-label={title}>
            <svg viewBox="0 0 40 32" className="h-[1.6em] w-auto shrink-0" aria-hidden="true" fill="none">
                <path d="M2 30 L20 3 L38 30" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="miter" />
                <path d="M11 30 L20 16.5 L29 30" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="miter" opacity="0.55" />
            </svg>
            {showWordmark ? (
                <span aria-hidden="true" className="text-[1em] font-medium leading-none tracking-[0.22em]">
                    ALTIUS
                </span>
            ) : null}
        </span>
    );
}
