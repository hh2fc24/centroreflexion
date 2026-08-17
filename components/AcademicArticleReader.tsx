'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MotionDiv } from '@/components/ui/Motion';
import { Article } from '@/lib/data';

interface ParsedBlock {
  type: 'heading' | 'paragraph' | 'blockquote' | 'reference' | 'intro-paragraph';
  text: string;
  id?: string;
}

export default function AcademicArticleReader({ article }: { article: Article }) {
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
    
    if (line.startsWith('PALABRAS CLAVE:')) {
      keywords = line.replace('PALABRAS CLAVE:', '').split(',').map(k => k.trim());
      continue;
    }
    
    if (line.match(/^(?:BIBLIOGRAFÍA|REFERENCIAS)$/i) || line === 'REFERENCIAS' || line === 'BIBLIOGRAFÍA') {
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
    const isNumberedHeading = /^\d+\.\s+[A-ZÁÉÍÓÚÑ]/.test(line);
    const isAllCapsHeading = line === line.toUpperCase() && line.length > 4 && /[A-ZÁÉÍÓÚÑ]/.test(line);
    
    if ((isNumberedHeading || isAllCapsHeading) && line.length < 150) {
      const id = line.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '');
      parsedContent.push({ type: 'heading', text: line, id });
      toc.push({ id, title: line });
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

  const renderImage = () => {
    if (!article.image) return null;
    return (
      <figure className="my-10 mx-auto w-full max-w-4xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-[#ded5c7]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <figcaption className="mt-3 text-sm text-[#70695f] text-center font-serif italic">
          Figura 1. {article.title}
        </figcaption>
      </figure>
    );
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#171713] font-serif selection:bg-[#d3976d]/30">
      {/* Top Bar */}
      <div className="border-b border-[#ded5c7] bg-[#fffdf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs tracking-widest text-[#70695f] uppercase">
          <Link href="/trabajos-intelectuales" className="flex items-center hover:text-[#bd6f3c] transition-colors">
            <ArrowLeft className="w-3 h-3 mr-2" />
            Volver
          </Link>
          <span>Trabajo Intelectual · Centro de Reflexiones Críticas</span>
          <span className="hidden sm:inline-block">CRC</span>
        </div>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-serif text-[#171713] leading-tight md:leading-[1.15] mb-8 max-w-3xl mx-auto">
          {article.title.charAt(0).toUpperCase() + article.title.slice(1).toLowerCase().replace(/[""\u201c\u201d]([a-záéíóúñ])/g, (_, c) => `"${c.toUpperCase()}`).replace(/\.\s+[a-záéíóúñ]/g, m => m.toUpperCase())}
        </h1>
        
        <div className="flex flex-col items-center justify-center space-y-2 text-[#70695f]">
          <div className="text-lg">
            <span className="text-[#171713]">Autor:</span> {article.author}
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span>{article.date}</span>
            <span className="w-1 h-1 rounded-full bg-[#bd6f3c]"></span>
            <span className="uppercase tracking-wider">{article.category}</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-[#ded5c7]" />
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Main Column */}
          <main className="lg:w-2/3 xl:w-3/4 flex-shrink-0">
            
            {/* Abstract Section */}
            {(abstract || keywords.length > 0) && (
              <MotionDiv 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#f8f5ee] border-l-4 border-[#bd6f3c] p-6 md:p-8 mb-12 shadow-sm"
              >
                <h3 className="text-[#bd6f3c] font-bold uppercase tracking-widest text-sm mb-4">Resumen</h3>
                {abstract && (
                  <p className="font-serif italic text-lg leading-relaxed text-[#171713] mb-6">
                    {abstract}
                  </p>
                )}
                {keywords.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-[#70695f] mb-2">Palabras Clave</h4>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-[#ded5c7] text-[#171713] text-xs uppercase tracking-wider rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </MotionDiv>
            )}

            {renderImage()}

            {/* Content Body */}
            <div className="article-body font-serif text-lg md:text-xl leading-8 md:leading-9 text-[#171713] space-y-8">
              {parsedContent.map((block, idx) => {
                switch (block.type) {
                  case 'heading':
                    const match = block.text.match(/^(\d+\.)\s+(.*)$/);
                    if (match) {
                      return (
                        <h2 key={idx} id={block.id} className="text-2xl md:text-3xl font-bold mt-16 mb-8 text-[#171713] flex items-baseline border-l-4 border-[#d3976d] pl-4 scroll-mt-24">
                          <span className="text-[#bd6f3c] mr-3">{match[1]}</span>
                          {match[2]}
                        </h2>
                      );
                    }
                    return (
                      <h2 key={idx} id={block.id} className="text-2xl md:text-3xl font-bold mt-16 mb-8 text-[#171713] border-l-4 border-[#bd6f3c] pl-4 scroll-mt-24">
                        {block.text}
                      </h2>
                    );
                    
                  case 'intro-paragraph':
                    return (
                      <p key={idx} className="text-justify first-letter:text-6xl first-letter:font-bold first-letter:text-[#bd6f3c] first-letter:mr-3 first-letter:float-left first-line:uppercase first-line:tracking-widest">
                        {block.text}
                      </p>
                    );
                    
                  case 'blockquote':
                    return (
                      <blockquote key={idx} className="ml-4 md:ml-12 pl-6 border-l-2 border-[#d3976d] font-serif italic text-[#70695f] text-base md:text-lg leading-relaxed py-2">
                        {block.text}
                      </blockquote>
                    );
                    
                  case 'reference':
                    return (
                      <p key={idx} className="pl-8 -indent-8 text-base text-[#70695f] mb-4 leading-relaxed">
                        {block.text}
                      </p>
                    );
                    
                  case 'paragraph':
                  default:
                    return (
                      <p key={idx} className="text-justify">
                        {block.text}
                      </p>
                    );
                }
              })}
            </div>

            {/* Author Footer */}
            <div className="mt-20 pt-10 border-t border-[#eee8dc]">
              <div className="bg-[#f8f5ee] p-8 rounded-sm">
                <h3 className="text-lg font-bold text-[#171713] mb-2">Sobre el autor</h3>
                <p className="text-[#70695f] font-serif">
                  <strong>{article.author}</strong> — Doctor en Trabajo Social de la Universidad Alberto Hurtado.
                  Este artículo fue publicado el {article.date} en la categoría {article.category}.
                </p>
              </div>
              <div className="mt-8 text-center">
                <Link 
                  href="/trabajos-intelectuales"
                  className="inline-flex items-center px-6 py-3 border border-[#bd6f3c] text-[#bd6f3c] hover:bg-[#bd6f3c] hover:text-white transition-colors duration-300 font-serif uppercase tracking-widest text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Explorar más trabajos
                </Link>
              </div>
            </div>
            
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/3 xl:w-1/4 hidden lg:block">
            <div className="sticky top-24 space-y-10">
              
              {/* Metadata Card */}
              <div className="p-6 border border-[#eee8dc] bg-white rounded-sm shadow-sm">
                <h4 className="text-xs uppercase tracking-widest text-[#70695f] mb-4 border-b border-[#eee8dc] pb-2">Metadatos del Artículo</h4>
                <dl className="space-y-4 text-sm font-serif">
                  <div>
                    <dt className="text-[#70695f] uppercase text-[10px] tracking-wider">Autor</dt>
                    <dd className="text-[#171713]">{article.author}</dd>
                  </div>
                  <div>
                    <dt className="text-[#70695f] uppercase text-[10px] tracking-wider">Fecha de Publicación</dt>
                    <dd className="text-[#171713]">{article.date}</dd>
                  </div>
                  <div>
                    <dt className="text-[#70695f] uppercase text-[10px] tracking-wider">Categoría</dt>
                    <dd className="text-[#171713]">{article.category}</dd>
                  </div>
                  {keywords.length > 0 && (
                    <div>
                      <dt className="text-[#70695f] uppercase text-[10px] tracking-wider mb-1">Palabras Clave</dt>
                      <dd className="flex flex-wrap gap-1">
                        {keywords.map((kw, i) => (
                          <span key={i} className="text-[#171713] after:content-[','] last:after:content-['']">
                            {kw}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Table of Contents */}
              {toc.length > 0 && (
                <div className="p-6 bg-[#f8f5ee] rounded-sm">
                  <h4 className="text-xs uppercase tracking-widest text-[#70695f] mb-4 border-b border-[#ded5c7] pb-2">Contenido</h4>
                  <ul className="space-y-3 text-sm font-serif">
                    {toc.map((item, i) => (
                      <li key={i}>
                        <a 
                          href={`#${item.id}`} 
                          className="text-[#171713] hover:text-[#bd6f3c] transition-colors line-clamp-2 leading-relaxed"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Thumbnail */}
              {article.image && (
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-[#ded5c7] opacity-80 hover:opacity-100 transition-opacity">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-serif italic line-clamp-3">
                    {article.title}
                  </div>
                </div>
              )}
              
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
