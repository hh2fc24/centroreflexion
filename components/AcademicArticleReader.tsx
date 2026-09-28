'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { Article, ArticleAuthor } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import { TypographicCover, displayTitle, isRealPhoto, toSentenceCase } from '@/components/TypographicCover';

interface ParsedBlock {
  type: 'heading' | 'paragraph' | 'blockquote' | 'reference' | 'intro-paragraph';
  text: string;
  id?: string;
}

export default function AcademicArticleReader({ article }: { article: Article }) {
  const authors: ArticleAuthor[] = article.authors?.length ? article.authors : [{ name: article.author }];
  // Parse content
  let abstract = '';
  let keywords: string[] = [];
  const toc: { id: string; title: string }[] = [];
  const parsedContent: ParsedBlock[] = [];
  
  let inReferences = false;
  let hasIntroParagraph = false;
  
  for (let i = 0; i < article.content.length; i++) {
    const originalLine = article.content[i];
    const line = originalLine.trim();
    if (!line) continue;
    
    if (line === 'Resumen') {
      abstract = article.content[i + 1]?.trim() || '';
      i++; // skip abstract text
      continue;
    }
    
    if (/^PALABRAS CLAVE:/i.test(line)) {
      keywords = line.replace(/^PALABRAS CLAVE:/i, '').split(/[;,]/).map(k => k.trim());
      continue;
    }
    
    if (/^(?:\d+\.\s+)?(?:BIBLIOGRAFÍA|REFERENCIAS(?: BIBLIOGRÁFICAS)?)$/i.test(line)) {
      inReferences = true;
      const id = 'referencias';
      parsedContent.push({ type: 'heading', text: line, id });
      toc.push({ id, title: line });
      continue;
    }
    
    if (inReferences) {
      parsedContent.push({ type: 'reference', text: line });
      continue;
    }
    
    // Check if it's a section heading
    // 1. All caps (and not a single word like "A")
    // 2. Starts with number like "1. TITLE"
    const isNumberedHeading = /^\d+(?:\.\d+)*\.\s+[A-ZÁÉÍÓÚÑ]/.test(line);
    const isAllCapsHeading = line === line.toUpperCase() && line.length > 4 && /[A-ZÁÉÍÓÚÑ]/.test(line);
    const isExplicitHeading = /^#{2,3}\s+/.test(line);
    
    if ((isNumberedHeading || isAllCapsHeading || isExplicitHeading) && line.length < 150) {
      const heading = line.replace(/^#{2,3}\s+/, '');
      const id = heading.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      parsedContent.push({ type: 'heading', text: heading, id });
      toc.push({ id, title: heading });
      continue;
    }
    
    // Block quotes
    const isBlockquote = originalLine.startsWith('  ') || originalLine.startsWith('\t') || line.startsWith('«') || line.startsWith('"') || (line.startsWith('>') && line.length > 1);
    if (isBlockquote && line.length > 30) {
      parsedContent.push({ type: 'blockquote', text: line.replace(/^>\s*/, '') });
      continue;
    }
    
    // Check references by format if we didn't catch the heading
    if (/^[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\s\-,]+(?:,\s+[A-Z]\.)?\s*\(\d{4}\)/.test(line)) {
      parsedContent.push({ type: 'reference', text: line });
      continue;
    }
    
    // Normal paragraph
    if (!hasIntroParagraph && toc.length > 0) {
      // First paragraph after the first heading (presumably Intro)
      parsedContent.push({ type: 'intro-paragraph', text: line });
      hasIntroParagraph = true;
    } else {
      parsedContent.push({ type: 'paragraph', text: line });
    }
  }

  if (article.footnotes?.length) toc.push({ id: 'notas', title: 'Notas' });

  const renderText = (text: string) => text.split(/(\[\d+\]|https?:\/\/[^\s]+)/).map((part, index) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match && article.footnotes?.some(note => note.id === Number(match[1]))) {
      return <sup key={index} className="ml-0.5 text-xs"><a href={`#nota-${match[1]}`} aria-label={`Ver nota ${match[1]}`} className="text-[#9f5528] underline underline-offset-2">{match[1]}</a></sup>;
    }
    if (/^https?:\/\//.test(part)) {
      const urlMatch = part.match(/^(.*?)([.,;:]*)$/);
      const url = urlMatch?.[1] || part;
      const trailing = urlMatch?.[2] || '';
      return <React.Fragment key={index}><a href={url} target="_blank" rel="noopener noreferrer" className="break-all text-[#9f5528] underline underline-offset-2">{url}</a>{trailing}</React.Fragment>;
    }
    return part;
  });

  // Solo fotos reales (docs/design-system-crc.md §4); las ilustraciones no se muestran.
  const renderImage = () => {
    if (!isRealPhoto(article.image)) return null;
    return (
      <figure className="mb-12">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[6px] bg-[#eee8dc]">
          <Image
            src={article.image}
            alt={article.imageAlt || article.title}
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover"
            priority
          />
        </div>
        {article.imageCaption && <figcaption className="mt-3 text-[0.875rem] text-[#6f675d]">
          {article.imageCaption}
        </figcaption>}
      </figure>
    );
  };

  // Los títulos en mayúsculas del original pasan a tipo oración; el resto se respeta.
  const headingCase = displayTitle;

  const authorNames = authors.map(author => author.name).join(' · ');
  const labelClass = 'text-[0.8125rem] font-semibold text-[#9f5528]';

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#171713] selection:bg-[#e4935d]/30">
      {/* Cabecera: portada tipográfica con el h1 */}
      <TypographicCover
        size="hero"
        titleAs="h1"
        tone="ink"
        containerClassName="max-w-6xl"
        category={article.category}
        title={article.title}
        date={article.date}
      >
        <p className="mt-6 text-[0.9375rem] font-semibold text-[#f8f5ee]">
          {authorNames}{article.footnotes?.some(note => note.id === 1) && renderText('[1]')}
        </p>
        {article.publication && (
          <div className="mt-4 space-y-1 text-[0.9375rem] leading-[1.6] text-[#d8cfc0]">
            <p><cite className="not-italic">{article.publication.journal}</cite>, {article.publication.volume} ({article.publication.year}), pp. {article.publication.pages}.</p>
            <p>Recibido: {article.publication.received} · Aceptado: {article.publication.accepted}</p>
          </div>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.9375rem] font-semibold">
          <Link href="/trabajos-intelectuales" className="inline-flex items-center gap-2 underline-offset-4 hover:underline">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver a Trabajos intelectuales
          </Link>
          {article.publication && (
            <>
              <a href={`https://doi.org/${article.publication.doi}`} target="_blank" rel="noopener noreferrer" className="text-[#e4935d] underline underline-offset-4">DOI: {article.publication.doi}</a>
              <a href={article.publication.pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-[6px] border border-[#f8f5ee]/40 px-4 py-2 transition-colors hover:border-[#e4935d] hover:text-[#e4935d]"><FileText className="h-4 w-4" aria-hidden="true" />Leer PDF original</a>
            </>
          )}
        </div>
      </TypographicCover>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">

          <article className="min-w-0">

            {(abstract || keywords.length > 0) && (
              <section aria-labelledby="resumen" className="mb-12 max-w-[65ch] border-l-2 border-[#bd6f3c] pl-5 sm:pl-6">
                <h2 id="resumen" className={labelClass}>Resumen</h2>
                {abstract && (
                  <p className="crc-serif mt-3 text-[1.0625rem] leading-[1.7] text-[#171713] sm:text-[1.125rem]">
                    {abstract}
                  </p>
                )}
                {keywords.length > 0 && (
                  <p className="mt-5 text-[0.9375rem] leading-[1.6] text-[#55574f]">
                    <span className="font-semibold text-[#171713]">Palabras clave: </span>
                    {keywords.map(headingCase).join(' · ')}
                  </p>
                )}
              </section>
            )}

            {renderImage()}

            {toc.length > 0 && <details className="mb-10 max-w-[65ch] rounded-[6px] border border-[#d8cfc0] px-4 py-3 lg:hidden">
              <summary className="cursor-pointer text-[0.9375rem] font-semibold">Contenido del artículo</summary>
              <nav aria-label="Contenido del artículo" className="mt-3 flex flex-col gap-2.5 text-[0.9375rem]">
                {toc.map(item => <a key={item.id} href={`#${item.id}`} className="text-[#55574f] hover:text-[#9f5528]">{headingCase(item.title)}</a>)}
              </nav>
            </details>}

            {/* Cuerpo: Source Serif 4, ~65 caracteres, interlineado 1.7 */}
            <div className="article-body crc-serif max-w-[65ch] break-words text-[1.0625rem] leading-[1.7] text-[#171713] sm:text-[1.125rem]">
              {parsedContent.map((block, idx) => {
                switch (block.type) {
                  case 'heading': {
                    const match = block.text.match(/^(\d+(?:\.\d+)*\.)\s+(.*)$/);
                    const text = match ? match[2] : block.text;
                    return (
                      <h2 key={idx} id={block.id} className="mb-5 mt-14 scroll-mt-24 text-balance text-[clamp(1.4rem,2vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.01em] text-[#171713]">
                        {match && <span className="mr-2 text-[#9f5528] tabular-nums">{match[1]}</span>}
                        {headingCase(text)}
                      </h2>
                    );
                  }

                  case 'blockquote':
                    return (
                      <blockquote key={idx} className="my-8 border-l-2 border-[#d8cfc0] pl-5 font-sans text-[1rem] leading-[1.7] text-[#55574f]">
                        {renderText(block.text)}
                      </blockquote>
                    );

                  case 'reference':
                    return (
                      <p key={idx} className="mb-3 pl-8 -indent-8 font-sans text-[0.9375rem] leading-[1.6] text-[#55574f]">
                        {renderText(block.text)}
                      </p>
                    );

                  case 'intro-paragraph':
                  case 'paragraph':
                  default:
                    return (
                      <p key={idx} className="mb-6">
                        {renderText(block.text)}
                      </p>
                    );
                }
              })}
            </div>

            {!!article.footnotes?.length && <section id="notas" className="mt-16 max-w-[65ch] scroll-mt-24 border-t border-[#d8cfc0] pt-8">
              <h2 className="crc-serif mb-6 text-[1.5rem] font-semibold">Notas</h2>
              <ol className="space-y-4 text-[0.9375rem] leading-[1.6] text-[#55574f]">
                {article.footnotes.map(note => <li key={note.id} id={`nota-${note.id}`} className="flex scroll-mt-24 gap-3">
                  <span className="font-semibold tabular-nums text-[#9f5528]">{note.id}.</span><p>{note.text}</p>
                </li>)}
              </ol>
            </section>}

            {/* Autores */}
            <section className="mt-16 max-w-[65ch] border-t border-[#d8cfc0] pt-8">
              <h2 className="crc-serif text-[1.35rem] font-semibold text-[#171713]">{authors.length > 1 ? 'Sobre los autores' : 'Sobre el autor'}</h2>
              <div className="mt-4 space-y-4 text-[0.9375rem] leading-[1.7] text-[#55574f]">
                {authors.map((author) => (
                  <div key={author.name}>
                    <p><strong className="font-semibold text-[#171713]">{author.name}</strong>{author.bio ? ` — ${author.bio}` : ''}</p>
                    {(author.orcid || author.emails?.length) && (
                      <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[0.875rem]">
                        {author.orcid && <a href={author.orcid} target="_blank" rel="noopener noreferrer" className="text-[#9f5528] underline underline-offset-2">ORCID</a>}
                        {author.emails?.map(email => <a key={email} href={`mailto:${email}`} className="break-all text-[#9f5528] underline underline-offset-2">{email}</a>)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <Link
                href="/trabajos-intelectuales"
                className="mt-8 inline-flex items-center gap-2 rounded-[6px] border border-[#171713] px-5 py-3 text-[0.9375rem] font-semibold text-[#171713] transition-colors hover:border-[#9f5528] hover:text-[#9f5528]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Ver más trabajos
              </Link>
            </section>

          </article>

          {/* Barra lateral */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-10 overflow-y-auto pr-2">
              <dl className="space-y-4 border-t border-[#d8cfc0] pt-5 text-[0.9375rem]">
                <div>
                  <dt className={labelClass}>{authors.length > 1 ? 'Autores' : 'Autor'}</dt>
                  <dd className="mt-0.5 text-[#171713]">{authorNames}</dd>
                </div>
                <div>
                  <dt className={labelClass}>Fecha de publicación</dt>
                  <dd className="mt-0.5 tabular-nums text-[#171713]">{article.date}</dd>
                </div>
                <div>
                  <dt className={labelClass}>Categoría</dt>
                  <dd className="mt-0.5 text-[#171713]">{toSentenceCase(article.category)}</dd>
                </div>
              </dl>

              {toc.length > 0 && (
                <nav aria-label="Contenido del artículo" className="border-t border-[#d8cfc0] pt-5">
                  <p className={labelClass}>Contenido</p>
                  <ul className="mt-3 space-y-2.5 text-[0.9375rem]">
                    {toc.map((item, i) => (
                      <li key={i}>
                        <a href={`#${item.id}`} className="line-clamp-2 leading-[1.4] text-[#55574f] transition-colors hover:text-[#9f5528]">
                          {headingCase(item.title.replace(/^\d+(?:\.\d+)*\.\s+/, ''))}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </aside>

        </div>
      </div>
      <JsonLd article={article} />
    </div>
  );
}
