export type PageId = "home";

export type SectionType =
  | "hero"
  | "servicesPreview"
  | "latestArticles"
  | "publications"
  | "interviews"
  | "testimonials";

export type FontChoice = "inter" | "geist" | "merriweather";

export type ThemeMode = "light" | "dark";

export interface ThemeSettings {
  mode: ThemeMode;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  foreground: string;
  mutedForeground: string;
  border: string;
  font: FontChoice;
  textScale: number; // 0.9..1.15
  radius: number; // px
  shadow: number; // 0..1
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
  contactEmail: string;
  contactLocation: string;
  copyrightName: string;
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
  testimonials: Testimonial[];
  footer: FooterContent;
}
