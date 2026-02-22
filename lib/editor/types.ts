export type PageId = string;

export type SectionType =
  | "hero"
  | "servicesPreview"
  | "latestArticles"
  | "publications"
  | "interviews"
  | "testimonials"
  | "founders";

export type DeviceKind = "desktop" | "tablet" | "mobile";

export type FontChoice = "inter" | "geist" | "merriweather";

export type ThemeMode = "light" | "dark";

export type DesignPreset = "custom" | "minimal" | "corporate" | "premium";

export interface TextStyleOverride {
  color?: string;
  font?: FontChoice;
  fontSizePx?: number;
  fontWeight?: number;
  responsive?: {
    tablet?: Omit<TextStyleOverride, "responsive">;
    mobile?: Omit<TextStyleOverride, "responsive">;
  };
}

export type SpacingScale = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
};

export type RadiusScale = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
};

export type ShadowScale = {
  sm: number;
  md: number;
  lg: number;
};

export interface ThemeSettings {
  mode: ThemeMode;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  font: FontChoice;
  textScale: number; // 0.9..1.15
  radius: number; // px
  shadow: number; // 0..1
  designPreset: DesignPreset;
  spacingScale: SpacingScale;
  radiusScale: RadiusScale;
  shadowScale: ShadowScale;
  textStyles: Record<string, TextStyleOverride>;
}

export type BlockPreset = "minimal" | "corporate" | "premium" | "bold";

export type BlockType =
  // Legacy blocks (render existing sections/components)
  | "legacy.hero"
  | "legacy.founders"
  | "legacy.servicesPreview"
  | "legacy.latestArticles"
  | "legacy.publications"
  | "legacy.interviews"
  | "legacy.testimonials"
  // New reusable blocks
  | "globalRef"
  | "hero"
  | "features"
  | "cta"
  | "pricing"
  | "faq"
  | "logos"
  | "form"
  | "richText"
  | "spacer"
  | "embed";

export type ResponsiveValue<T> = {
  base: T;
  tablet?: Partial<T>;
  mobile?: Partial<T>;
};

export type TextAlign = "left" | "center" | "right";

export interface BlockStyle {
  paddingY: number; // px
  paddingX: number; // px
  maxWidth: number; // px
  background: string; // css color
  textAlign: TextAlign;
  radius: number; // px
  shadow: number; // 0..1
}

export type BlockAnimationType = "none" | "fade" | "slide" | "zoom";
export type BlockAnimationDirection = "up" | "down" | "left" | "right";

export interface BlockAnimation {
  type: BlockAnimationType;
  direction?: BlockAnimationDirection;
  delayMs?: number;
  durationMs?: number;
  once?: boolean;
}

export interface SiteBlock<TData = unknown> {
  id: string;
  type: BlockType;
  /**
   * Visual layout variant for this block type (layout only, content preserved).
   * Example: hero: "centered" | "split" | "video-bg" | ...
   */
  variant?: string;
  /**
   * Block schema version for future migrations.
   */
  schemaVersion?: number;
  visible: boolean;
  locked: boolean;
  preset: BlockPreset;
  data: TData;
  style: ResponsiveValue<BlockStyle>;
  animation?: BlockAnimation;
  visibleOn?: {
    desktop?: boolean;
    tablet?: boolean;
    mobile?: boolean;
  };
}

export interface PageSeo {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  noIndex: boolean;
  canonical: string;
}

export type PageKind = "page" | "global";

export interface PageChromeOverrides {
  useGlobalNavigation: boolean;
  useGlobalFooter: boolean;
  navigation?: NavigationContent;
  footer?: FooterContent;
}

export interface SitePage {
  id: string;
  slug: string; // "" for home, otherwise "foo" or "foo/bar"
  title: string;
  visible: boolean;
  kind?: PageKind;
  chrome?: PageChromeOverrides;
  seo: PageSeo;
  blocks: SiteBlock[];
  updatedAt: number;
}

export interface HeroContent {
  badgePrefix: string;
  badgeHighlight: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export interface ServicesPreviewCard {
  id: string;
  tone: "primary" | "secondary" | "success";
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

export interface ServicesPreviewContent {
  cards: ServicesPreviewCard[];
}

export interface LatestArticlesContent {
  title: string;
  linkLabel: string;
  linkHref: string;
}

export interface TestimonialsSectionContent {
  title: string;
  subtitle: string;
}

export interface PublicationsContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface InterviewsContent {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface Testimonial {
  id: string;
  name: string;
  category: string;
  text: string;
}

export interface FooterContent {
  brandTitle: string;
  brandHighlight: string;
  description: string;
  instagramHref: string;
  linkedinHref: string;
  whatsappHref: string;
  contactEmail: string;
  contactLocation: string;
  copyrightName: string;
  columns: FooterColumn[];
}

export interface FooterLink {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export interface FooterColumn {
  id: string;
  title: string;
  visible: boolean;
  links: FooterLink[];
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  children: NavItem[];
}

export interface NavigationContent {
  items: NavItem[];
}

export interface IntegrationsContent {
  googleAnalyticsId: string;
  googleTagId: string;
  metaPixelId: string;
  calLink: string;
}

export interface RedirectRule {
  id: string;
  from: string;
  to: string;
  permanent: boolean;
  enabled: boolean;
}

export interface Section<TData = unknown> {
  id: string;
  type: SectionType;
  visible: boolean;
  data: TData;
}

export interface HomePageContent {
  sections: Section[];
}

export interface FounderProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  imageSrc: string;
  href: string;
}

export interface FoundersContent {
  title: string;
  profiles: FounderProfile[];
}

export interface SiteContent {
  pages: {
    home: HomePageContent;
  };
  hero: HeroContent;
  homeServices: ServicesPreviewContent;
  homeLatest: LatestArticlesContent;
  homePublications: PublicationsContent;
  homeInterviews: InterviewsContent;
  homeTestimonials: TestimonialsSectionContent;
  homeFounders: FoundersContent;
  testimonials: Testimonial[];
  footer: FooterContent;
  navigation: NavigationContent;
  integrations: IntegrationsContent;
  redirects: RedirectRule[];
}
