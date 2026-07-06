"use client";

import { useCallback, useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "ac-theme";
const EVENT = "ac-theme-change";

function getContainer(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>("[data-academia]");
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

// Fuente de verdad: el atributo data-theme del contenedor (lo pone el script anti-FOUC).
function currentTheme(): Theme {
  const attr = getContainer()?.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : systemTheme();
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  const onSystem = () => {
    // Si el usuario ya eligió manualmente, respetar su elección
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    getContainer()?.setAttribute("data-theme", mq.matches ? "light" : "dark");
    onChange();
  };
  mq.addEventListener("change", onSystem);
  window.addEventListener(EVENT, onChange);
  return () => {
    mq.removeEventListener("change", onSystem);
    window.removeEventListener(EVENT, onChange);
  };
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "dark" as Theme);
  const isLight = theme === "light";

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === "light" ? "dark" : "light";
    getContainer()?.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* almacenamiento no disponible */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo día"}
      title={isLight ? "Modo oscuro" : "Modo día"}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${className}`}
      style={{ border: "1px solid var(--ac-border-md)", color: "var(--ac-text-2)" }}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
