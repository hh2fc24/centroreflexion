import { useContentStore, useEditorStore, useThemeStore } from "@/lib/editor/stores";
import type { PageId, Section, SectionType, Testimonial, TextStyleOverride, ThemeSettings } from "@/lib/editor/types";
import { useArticlesStore, type ArticleKind } from "@/lib/editor/articlesStore";
import type { Article } from "@/lib/data";
import { usePagesStore } from "@/lib/editor/pagesStore";
import type { SitePage, SiteBlock } from "@/lib/editor/types";
import { useTemplatesStore } from "@/lib/editor/templatesStore";
import type { BlockTemplate } from "@/lib/editor/templatesStore";
import { usePageTemplatesStore } from "@/lib/editor/pageTemplatesStore";
import type { PageTemplate } from "@/lib/editor/pageTemplatesStore";

export function useEditor() {
  const adminEnabled = useEditorStore((s) => s.adminEnabled);
  const selectedPage = useEditorStore((s) => s.selectedPage);
  const selectedSectionId = useEditorStore((s) => s.selectedSectionId);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const selectedBlockPageId = useEditorStore((s) => s.selectedBlockPageId);
  const selectedTextPath = useEditorStore((s) => s.selectedTextPath);
  const device = useEditorStore((s) => s.device);
  const setAdminEnabled = useEditorStore((s) => s.setAdminEnabled);
  const selectPage = useEditorStore((s) => s.selectPage);
  const selectSection = useEditorStore((s) => s.selectSection);
  const selectBlock = useEditorStore((s) => s.selectBlock);
  const selectText = useEditorStore((s) => s.selectText);
  const setDevice = useEditorStore((s) => s.setDevice);
  return {
    adminEnabled,
    selectedPage,
    selectedSectionId,
    selectedBlockId,
    selectedBlockPageId,
    selectedTextPath,
    device,
    setAdminEnabled,
    selectPage,
    selectSection,
    selectBlock,
    selectText,
    setDevice,
  };
}

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const lastChangedAt = useThemeStore((s) => s.lastChangedAt);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setTextStyle = useThemeStore((s) => s.setTextStyle);
  const resetTextStyle = useThemeStore((s) => s.resetTextStyle);
  const resetTheme = useThemeStore((s) => s.resetTheme);
  return { theme, lastChangedAt, setTheme, setTextStyle, resetTextStyle, resetTheme } as const satisfies {
    theme: ThemeSettings;
    lastChangedAt: number;
    setTheme: (partial: Partial<ThemeSettings>) => void;
    setTextStyle: (path: string, partial: Partial<TextStyleOverride>) => void;
    resetTextStyle: (path: string) => void;
    resetTheme: () => void;
  };
}

export function useContent() {
  const content = useContentStore((s) => s.content);
  const lastChangedAt = useContentStore((s) => s.lastChangedAt);

  const get = useContentStore((s) => s.get);
  const set = useContentStore((s) => s.set);
  const reset = useContentStore((s) => s.reset);

  const getHomeSections = useContentStore((s) => s.getHomeSections);
  const setHomeSections = useContentStore((s) => s.setHomeSections);
  const toggleHomeSection = useContentStore((s) => s.toggleHomeSection);
  const deleteHomeSection = useContentStore((s) => s.deleteHomeSection);
  const duplicateHomeSection = useContentStore((s) => s.duplicateHomeSection);
  const addHomeSection = useContentStore((s) => s.addHomeSection);

  const addTestimonial = useContentStore((s) => s.addTestimonial);
  const updateTestimonial = useContentStore((s) => s.updateTestimonial);
  const deleteTestimonial = useContentStore((s) => s.deleteTestimonial);

  return {
    content,
    lastChangedAt,
    get,
    set,
    reset,
    getHomeSections,
    setHomeSections,
    toggleHomeSection,
    deleteHomeSection,
    duplicateHomeSection,
    addHomeSection,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } as const satisfies {
    content: typeof content;
    lastChangedAt: number;
    get: <T = unknown>(path: string) => T | undefined;
    set: (path: string, value: unknown) => void;
    reset: () => void;
    getHomeSections: () => Section[];
    setHomeSections: (sections: Section[]) => void;
    toggleHomeSection: (sectionId: string) => void;
    deleteHomeSection: (sectionId: string) => void;
    duplicateHomeSection: (sectionId: string) => void;
    addHomeSection: (type: SectionType) => void;
    addTestimonial: () => void;
    updateTestimonial: (id: string, partial: Partial<Omit<Testimonial, "id">>) => void;
    deleteTestimonial: (id: string) => void;
  };
}

export type { PageId };

export function usePages() {
  const pages = usePagesStore((s) => s.pages);
  const lastChangedAt = usePagesStore((s) => s.lastChangedAt);
  const findById = usePagesStore((s) => s.findById);
  const findBySlug = usePagesStore((s) => s.findBySlug);
  const findGlobalById = usePagesStore((s) => s.findGlobalById);
  const addPage = usePagesStore((s) => s.addPage);
  const duplicatePage = usePagesStore((s) => s.duplicatePage);
  const deletePage = usePagesStore((s) => s.deletePage);
  const updatePage = usePagesStore((s) => s.updatePage);
  const renameSlug = usePagesStore((s) => s.renameSlug);
  const addGlobalSection = usePagesStore((s) => s.addGlobalSection);
  const deleteGlobalSection = usePagesStore((s) => s.deleteGlobalSection);

  const addBlock = usePagesStore((s) => s.addBlock);
  const insertBlock = usePagesStore((s) => s.insertBlock);
  const duplicateBlock = usePagesStore((s) => s.duplicateBlock);
  const deleteBlock = usePagesStore((s) => s.deleteBlock);
  const reorderBlocks = usePagesStore((s) => s.reorderBlocks);
  const replaceBlocks = usePagesStore((s) => s.replaceBlocks);
  const toggleBlockVisible = usePagesStore((s) => s.toggleBlockVisible);
  const setBlockLocked = usePagesStore((s) => s.setBlockLocked);
  const updateBlock = usePagesStore((s) => s.updateBlock);
  const updateBlockData = usePagesStore((s) => s.updateBlockData);
  const setBlockPreset = usePagesStore((s) => s.setBlockPreset);
  const updateBlockStyle = usePagesStore((s) => s.updateBlockStyle);
  const insertGlobalRef = usePagesStore((s) => s.insertGlobalRef);
  const makeBlockGlobal = usePagesStore((s) => s.makeBlockGlobal);
  const detachGlobalRef = usePagesStore((s) => s.detachGlobalRef);
  const reset = usePagesStore((s) => s.reset);

  return {
    pages,
    lastChangedAt,
    findById,
    findBySlug,
    findGlobalById,
    addPage,
    duplicatePage,
    deletePage,
    updatePage,
    renameSlug,
    addGlobalSection,
    deleteGlobalSection,
    addBlock,
    insertBlock,
    duplicateBlock,
    deleteBlock,
    reorderBlocks,
    replaceBlocks,
    toggleBlockVisible,
    setBlockLocked,
    updateBlock,
    updateBlockData,
    setBlockPreset,
    updateBlockStyle,
    insertGlobalRef,
    makeBlockGlobal,
    detachGlobalRef,
    reset,
  } as const satisfies {
    pages: SitePage[];
    lastChangedAt: number;
    findById: (id: string) => SitePage | null;
    findBySlug: (slug: string) => SitePage | null;
    findGlobalById: (id: string) => SitePage | null;
    addPage: () => string;
    duplicatePage: (id: string) => string | null;
    deletePage: (id: string) => void;
    updatePage: (id: string, partial: Partial<Omit<SitePage, "id" | "blocks">>) => void;
    renameSlug: (id: string, nextSlug: string) => void;
    addGlobalSection: (name?: string) => string;
    deleteGlobalSection: (id: string) => void;
    addBlock: (pageId: string, type: SiteBlock["type"], preset?: SiteBlock["preset"]) => string | null;
    insertBlock: (pageId: string, block: SiteBlock, afterBlockId?: string | null) => string | null;
    duplicateBlock: (pageId: string, blockId: string) => string | null;
    deleteBlock: (pageId: string, blockId: string) => void;
    reorderBlocks: (pageId: string, next: SiteBlock[]) => void;
    replaceBlocks: (pageId: string, next: SiteBlock[]) => void;
    toggleBlockVisible: (pageId: string, blockId: string) => void;
    setBlockLocked: (pageId: string, blockId: string, locked: boolean) => void;
    updateBlock: (pageId: string, blockId: string, partial: Partial<Omit<SiteBlock, "id">>) => void;
    updateBlockData: (pageId: string, blockId: string, data: unknown) => void;
    setBlockPreset: (pageId: string, blockId: string, preset: SiteBlock["preset"]) => void;
    updateBlockStyle: (pageId: string, blockId: string, style: SiteBlock["style"]) => void;
    insertGlobalRef: (pageId: string, globalPageId: string, afterBlockId?: string | null) => string | null;
    makeBlockGlobal: (pageId: string, blockId: string, name?: string) => string | null;
    detachGlobalRef: (pageId: string, blockId: string) => void;
    reset: () => void;
  };
}

export function useArticles() {
  const columns = useArticlesStore((s) => s.columns);
  const reviews = useArticlesStore((s) => s.reviews);
  const lastChangedAt = useArticlesStore((s) => s.lastChangedAt);
  const add = useArticlesStore((s) => s.add);
  const rename = useArticlesStore((s) => s.rename);
  const update = useArticlesStore((s) => s.update);
  const replace = useArticlesStore((s) => s.replace);
  const remove = useArticlesStore((s) => s.remove);
  const reset = useArticlesStore((s) => s.reset);

  return {
    columns,
    reviews,
    lastChangedAt,
    add,
    rename,
    update,
    replace,
    remove,
    reset,
  } as const satisfies {
    columns: Article[];
    reviews: Article[];
    lastChangedAt: number;
    add: (kind: ArticleKind) => string;
    rename: (kind: ArticleKind, id: string, nextId: string) => void;
    update: (kind: ArticleKind, id: string, partial: Partial<Omit<Article, "id">>) => void;
    replace: (kind: ArticleKind, next: Article[]) => void;
    remove: (kind: ArticleKind, id: string) => void;
    reset: () => void;
  };
}

export function useTemplates() {
  const blocks = useTemplatesStore((s) => s.blocks);
  const addBlockTemplate = useTemplatesStore((s) => s.addBlockTemplate);
  const deleteBlockTemplate = useTemplatesStore((s) => s.deleteBlockTemplate);
  const renameBlockTemplate = useTemplatesStore((s) => s.renameBlockTemplate);
  const reset = useTemplatesStore((s) => s.reset);
  return { blocks, addBlockTemplate, deleteBlockTemplate, renameBlockTemplate, reset } as const satisfies {
    blocks: BlockTemplate[];
    addBlockTemplate: (name: string, block: SiteBlock) => string;
    deleteBlockTemplate: (id: string) => void;
    renameBlockTemplate: (id: string, name: string) => void;
    reset: () => void;
  };
}

export function usePageTemplates() {
  const templates = usePageTemplatesStore((s) => s.templates);
  const addPageTemplate = usePageTemplatesStore((s) => s.addPageTemplate);
  const deletePageTemplate = usePageTemplatesStore((s) => s.deletePageTemplate);
  const renamePageTemplate = usePageTemplatesStore((s) => s.renamePageTemplate);
  const reset = usePageTemplatesStore((s) => s.reset);
  return { templates, addPageTemplate, deletePageTemplate, renamePageTemplate, reset } as const satisfies {
    templates: PageTemplate[];
    addPageTemplate: (name: string, page: SitePage) => string;
    deletePageTemplate: (id: string) => void;
    renamePageTemplate: (id: string, name: string) => void;
    reset: () => void;
  };
}
