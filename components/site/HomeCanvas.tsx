"use client";

import Image from "next/image";
import { ArrowRight, BookOpen, PenTool, Star } from "lucide-react";
import { MotionDiv, MotionItem, MotionList } from "@/components/ui/Motion";
import { Hero } from "@/components/Hero";
import { PublicationsSection } from "@/components/PublicationsSection";
import { InterviewsSection } from "@/components/InterviewsSection";
import { SectionChrome } from "@/components/editor/SectionChrome";
import { EditorLink } from "@/components/editor/EditorLink";
import { EditableText } from "@/components/editor/EditableText";
import { EditableAtom } from "@/components/editor/EditableAtom";
import { useContent, useEditor } from "@/lib/editor/hooks";
import type { Section } from "@/lib/editor/types";
import { columns, reviews } from "@/lib/data";
import { FoundersSection } from "@/components/site/FoundersSection";

function sectionLabel(type: Section["type"]) {
  switch (type) {
    case "hero":
      return "Hero";
    case "founders":
      return "Directores";
    case "servicesPreview":
      return "Servicios";
    case "latestArticles":
      return "Lo más reciente";
    case "publications":
      return "Publicaciones";
    case "interviews":
      return "Multimedia";
    case "testimonials":
      return "Opiniones";
  }
}

export function HomeCanvas() {
  const { getHomeSections, content, updateTestimonial, deleteTestimonial } = useContent();
  const { adminEnabled } = useEditor();
  const sections = getHomeSections();

  // Curated featured articles (same logic as original `app/page.tsx`)
  const article1 = columns.find((c) => c.id === "elecciones-polarizacion") || columns[0]!;
  const article2 = reviews.find((r) => r.id === "soledad-garcia-marquez") || reviews[0]!;
  const article3 = columns.find((c) => c.id === "mito-progreso") || columns[2]!;

  const featuredArticles = [
    { ...article1, link: `/columnas/${article1.id}` },
    { ...article2, link: `/critica/${article2.id}` },
    { ...article3, link: `/columnas/${article3.id}` },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {sections.map((section) => {
        if (!section.visible) return null;

        const label = sectionLabel(section.type);
        if (section.type === "hero") {
          return (
            <SectionChrome key={section.id} section={section} label={label}>
              <Hero />
            </SectionChrome>
          );
        }

        if (section.type === "founders") {
          return (
            <SectionChrome key={section.id} section={section} label={label}>
              <FoundersSection />
            </SectionChrome>
          );
        }

        if (section.type === "servicesPreview") {
          const cards = content.homeServices.cards;
          return (
            <SectionChrome key={section.id} section={section} label={label}>
              <section className="relative z-20 -mt-24 pb-24 px-4 sm:px-6 lg:px-8">
                <MotionDiv
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mx-auto max-w-7xl"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card) => {
                      const toneClasses =
                        card.tone === "primary"
                          ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                          : card.tone === "secondary"
                            ? "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white"
                            : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white";

                      const ctaTone =
                        card.tone === "primary"
                          ? "text-primary"
                          : card.tone === "secondary"
                            ? "text-secondary"
                            : "text-emerald-600";

                      return (
                        <EditorLink key={card.id} href={card.href} className="group relative">
                          <div className="h-full relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-gray-100">
                            <div
                              className={`flex items-center justify-center w-12 h-12 rounded-xl mb-6 transition-colors ${toneClasses}`}
                            >
                              {card.tone === "secondary" ? (
                                <BookOpen className="h-6 w-6" />
                              ) : (
                                <PenTool className="h-6 w-6" />
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                              <EditableText
                                path={`homeServices.cards.${cards.findIndex((c) => c.id === card.id)}.title`}
                                ariaLabel="Servicio título"
                              />
                            </h3>
                            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                              <EditableText
                                path={`homeServices.cards.${cards.findIndex((c) => c.id === card.id)}.description`}
                                ariaLabel="Servicio descripción"
                                multiline
                              />
                            </p>
                            <div
                              className={`flex items-center ${ctaTone} text-sm font-semibold group-hover:translate-x-2 transition-transform`}
                            >
                              <EditableText
                                path={`homeServices.cards.${cards.findIndex((c) => c.id === card.id)}.ctaLabel`}
                                ariaLabel="Servicio CTA"
                              />{" "}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </div>
                          </div>
                        </EditorLink>
                      );
                    })}
                  </div>
                </MotionDiv>
              </section>
            </SectionChrome>
          );
        }

        if (section.type === "latestArticles") {
          return (
            <SectionChrome key={section.id} section={section} label={label}>
              <section className="py-24 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <MotionDiv className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      <EditableText path="homeLatest.title" ariaLabel="Últimos artículos título" />
                    </h2>
                    <EditorLink
                      href={content.homeLatest.linkHref}
                      className="text-sm font-semibold text-red-600 hover:text-red-500 group flex items-center"
                    >
                      <EditableText path="homeLatest.linkLabel" ariaLabel="Últimos artículos link" />{" "}
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </EditorLink>
                  </MotionDiv>

                  <MotionList className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-8">
                    {featuredArticles.map((post) => (
                      <MotionItem
                        key={post.id}
                        className="flex flex-col items-start justify-between group cursor-pointer"
                      >
                        <EditorLink
                          href={post.link}
                          className="relative w-full aspect-[16/9] mb-4 bg-gray-100 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow block"
                        >
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </EditorLink>
                        <div className="flex items-center gap-x-4 text-xs">
                          <time dateTime={post.date} className="text-gray-500">
                            {post.date}
                          </time>
                          <span
                            className={`relative z-10 rounded-full px-3 py-1.5 font-medium ${post.category === "Política"
                                ? "bg-blue-50 text-blue-600"
                                : post.category === "Literatura"
                                  ? "bg-purple-50 text-purple-600"
                                  : "bg-green-50 text-green-600"
                              }`}
                          >
                            {post.category}
                          </span>
                        </div>
                        <div className="group relative">
                          <h3 className="mt-3 text-lg font-bold leading-6 text-gray-900 group-hover:text-blue-600 transition-colors">
                            <EditorLink href={post.link}>
                              <span className="absolute inset-0" />
                              {post.title}
                            </EditorLink>
                          </h3>
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt}</p>
                        </div>
                      </MotionItem>
                    ))}
                  </MotionList>
                </div>
              </section>
            </SectionChrome>
          );
        }

        if (section.type === "publications") {
          return (
            <SectionChrome key={section.id} section={section} label={label}>
              <PublicationsSection />
            </SectionChrome>
          );
        }

        if (section.type === "interviews") {
          return (
            <SectionChrome key={section.id} section={section} label={label}>
              <InterviewsSection />
            </SectionChrome>
          );
        }

        if (section.type === "testimonials") {
          return (
            <SectionChrome key={section.id} section={section} label={label}>
              <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-12">
                    <div className="max-w-2xl">
                      <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">
                        <EditableText path="homeTestimonials.title" ariaLabel="Opiniones título" />
                      </h2>
                      <p className="mt-3 text-lg text-gray-600">
                        <EditableText path="homeTestimonials.subtitle" ariaLabel="Opiniones subtítulo" multiline />
                      </p>
                    </div>
                    {adminEnabled ? (
                      <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span>Editable en vivo</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {content.testimonials.map((t) => (
                      <div
                        key={t.id}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

                        <div className="relative">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                <EditableAtom
                                  value={t.name}
                                  ariaLabel="Testimonio nombre"
                                  onCommit={(next) => updateTestimonial(t.id, { name: next })}
                                />
                              </div>
                              <div className="mt-1 inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                                <EditableAtom
                                  value={t.category}
                                  ariaLabel="Testimonio categoría"
                                  onCommit={(next) => updateTestimonial(t.id, { category: next })}
                                />
                              </div>
                            </div>
                            {adminEnabled ? (
                              <button
                                type="button"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600"
                                aria-label="Eliminar testimonio"
                                onClick={() => {
                                  const ok = window.confirm("¿Eliminar este testimonio?");
                                  if (!ok) return;
                                  deleteTestimonial(t.id);
                                }}
                              >
                                ×
                              </button>
                            ) : null}
                          </div>

                          <div className="mt-4 text-gray-700 leading-relaxed text-sm">
                            <EditableAtom
                              value={t.text}
                              ariaLabel="Testimonio texto"
                              multiline
                              onCommit={(next) => updateTestimonial(t.id, { text: next })}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </SectionChrome>
          );
        }

        return null;
      })}
    </div>
  );
}
