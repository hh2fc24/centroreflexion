import type { SiteContent, ThemeSettings } from "@/lib/editor/types";

export const DEFAULT_THEME: ThemeSettings = {
  mode: "light",
  primary: "#2563eb", // blue-600
  secondary: "#a855f7", // purple-500
  background: "#ffffff",
  surface: "#ffffff",
  foreground: "#0f172a", // slate-900
  mutedForeground: "#475569", // slate-600
  border: "rgba(148,163,184,0.25)", // slate-400/25
  font: "inter",
  textScale: 1,
  radius: 16,
  shadow: 0.6,
};

export const DEFAULT_CONTENT: SiteContent = {
  pages: {
    home: {
      sections: [
        { id: "sec-hero", type: "hero", visible: true, data: {} },
        { id: "sec-services-preview", type: "servicesPreview", visible: true, data: {} },
        { id: "sec-latest", type: "latestArticles", visible: true, data: {} },
        { id: "sec-publications", type: "publications", visible: true, data: {} },
        { id: "sec-interviews", type: "interviews", visible: true, data: {} },
        { id: "sec-testimonials", type: "testimonials", visible: true, data: {} },
      ],
    },
  },
  hero: {
    badgePrefix: "Centro de Reflexiones",
    badgeHighlight: "Críticas",
    titleBefore: "Pensamiento autónomo para",
    titleHighlight: "soluciones estratégicas",
    titleAfter: "con foco en la evidencia científica.",
    subtitle:
      "Producción editorial, atención clínica, consultoría estratégica en salud mental, educación y políticas públicas de la infancia.",
    primaryCtaLabel: "Conocer Servicios",
    primaryCtaHref: "/servicios",
    secondaryCtaLabel: "Pensamiento Crítico",
    secondaryCtaHref: "/pensamiento-critico",
  },
  homeServices: {
    cards: [
      {
        id: "svc-consultoria",
        tone: "primary",
        title: "Consultoría Estratégica",
        description:
          "Diseño y evaluación de programas sociales, gestión institucional y arquitectura programática.",
        ctaLabel: "Ver Servicios",
        href: "/servicios#consultoria",
      },
      {
        id: "svc-clinica",
        tone: "secondary",
        title: "Atención Clínica",
        description:
          "Psicoterapia, evaluación de competencias parentales y terapia ocupacional online y domiciliaria.",
        ctaLabel: "Agendar Atención",
        href: "/servicios#clinica",
      },
      {
        id: "svc-formacion",
        tone: "success",
        title: "Charlas y Formación",
        description:
          "Capacitaciones, asesorías educativas y espacios de formación para equipos y comunidades.",
        ctaLabel: "Ver Programa",
        href: "/servicios#formacion",
      },
    ],
  },
  homeLatest: {
    title: "Lo más reciente",
    linkLabel: "Ver todo",
    linkHref: "/pensamiento-critico",
  },
  homePublications: {
    eyebrow: "PUBLICACIONES",
    title: "Libros Publicados",
    subtitle:
      "Investigaciones que profundizan en la infancia, la biopolítica y la salud mental desde una perspectiva crítica.",
  },
  homeInterviews: {
    eyebrow: "MULTIMEDIA",
    title: 'Juan Carlos Rauld y "Tecnócratas de la Infancia"',
    subtitle:
      '"La niñez pobre siempre ha sido, tanto por izquierdas como por derechas, administrada bajo la lógica del encierro"',
  },
  homeTestimonials: {
    title: "Opiniones",
    subtitle: "Lo que cambia cuando el acompañamiento es claro y humano.",
  },
  testimonials: [
    {
      id: "t-1",
      name: "María P.",
      category: "Atención clínica",
      text: "Me sentí acompañada desde el primer minuto. Claridad, cuidado y foco en lo importante.",
    },
    {
      id: "t-2",
      name: "Equipo Municipal",
      category: "Consultoría",
      text: "Ordenaron nuestro programa y nos dejaron una hoja de ruta accionable. Trabajo serio y ágil.",
    },
    {
      id: "t-3",
      name: "Coordinación PIE",
      category: "Formación",
      text: "Una formación práctica y profunda, con ejemplos reales. Se nota la experiencia en terreno.",
    },
  ],
  footer: {
    brandTitle: "Centro de Reflexiones",
    brandHighlight: "Críticas",
    description:
      "Plataforma de pensamiento crítico, servicios clínicos y consultoría estratégica. Articulando academia, intervención y políticas públicas.",
    instagramHref: "https://www.instagram.com/centrodereflexionescriticas/",
    linkedinHref: "#",
    contactEmail: "centrodereflexionescriticas@gmail.com",
    contactLocation: "Santiago, Chile",
    copyrightName: "Centro de Reflexiones Críticas",
  },
};
