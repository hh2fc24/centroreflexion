"use client";

import type { ComponentType } from "react";
import type { SiteBlock } from "@/lib/editor/types";
import { HeroBlock, HERO_VARIANTS } from "@/components/site/blocks/HeroBlock";
import { RichTextBlock } from "@/components/site/blocks/RichTextBlock";
import { FeaturesBlock } from "@/components/site/blocks/FeaturesBlock";
import { CtaBlock, CTA_VARIANTS } from "@/components/site/blocks/CtaBlock";
import { FaqBlock, FAQ_VARIANTS } from "@/components/site/blocks/FaqBlock";
import { PricingBlock, PRICING_VARIANTS } from "@/components/site/blocks/PricingBlock";
import { LogosBlock } from "@/components/site/blocks/LogosBlock";
import { SpacerBlock } from "@/components/site/blocks/SpacerBlock";
import { EmbedBlock } from "@/components/site/blocks/EmbedBlock";
import { FormBlock } from "@/components/site/blocks/FormBlock";
import { LegacyBlock } from "@/components/site/blocks/LegacyBlock";
import { GlobalRefBlock } from "@/components/site/blocks/GlobalRefBlock";

export type BlockRenderProps = { pageId: string; block: SiteBlock; editable: boolean };
export type BlockDefinition = {
  type: string;
  title: string;
  Component: ComponentType<BlockRenderProps>;
  variants?: readonly string[];
  schemaVersion?: number;
};

const custom = new Map<string, BlockDefinition>();

function wrap(
  title: string,
  Component: ComponentType<BlockRenderProps>,
  variants?: readonly string[]
): BlockDefinition {
  return { type: title, title, Component, variants };
}

const BUILTIN: Record<string, BlockDefinition> = {
  globalRef: {
    type: "globalRef",
    title: "Global ref",
    Component: ({ block, editable }: BlockRenderProps) => <GlobalRefBlock block={block} editable={editable} />,
  },
  hero: wrap("hero", HeroBlock, HERO_VARIANTS),
  richText: wrap("richText", RichTextBlock),
  features: wrap("features", FeaturesBlock),
  cta: wrap("cta", CtaBlock, CTA_VARIANTS),
  faq: wrap("faq", FaqBlock, FAQ_VARIANTS),
  pricing: wrap("pricing", PricingBlock, PRICING_VARIANTS),
  logos: wrap("logos", LogosBlock),
  form: wrap("form", FormBlock),
  spacer: wrap("spacer", SpacerBlock),
  embed: wrap("embed", EmbedBlock),
  "legacy.hero": wrap("legacy.hero", LegacyBlock),
  "legacy.founders": wrap("legacy.founders", LegacyBlock),
  "legacy.servicesPreview": wrap("legacy.servicesPreview", LegacyBlock),
  "legacy.latestArticles": wrap("legacy.latestArticles", LegacyBlock),
  "legacy.publications": wrap("legacy.publications", LegacyBlock),
  "legacy.interviews": wrap("legacy.interviews", LegacyBlock),
  "legacy.testimonials": wrap("legacy.testimonials", LegacyBlock),
};

export function registerBlock(def: BlockDefinition) {
  if (!def?.type) return;
  if (BUILTIN[def.type]) return;
  custom.set(def.type, def);
}

export function getBlockDefinition(type: string): BlockDefinition | null {
  return BUILTIN[type] ?? custom.get(type) ?? null;
}
