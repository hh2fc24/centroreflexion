import articles from "@/lib/articles.json";
import readersData from "@/lib/readers.json";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string; // "08 Feb 2026"
  category: string;
  image: string;
  imageAlt?: string;
  imageCaption?: string;
  content: string[];
  footnotes?: { id: number; text: string }[];
  publication?: {
    journal: string;
    volume: string;
    pages: string;
    year: string;
    doi: string;
    received: string;
    accepted: string;
    pdf: string;
  };
}

type ArticlesJson = { columns: Article[]; reviews: Article[] };

export const columns: Article[] = (articles as unknown as ArticlesJson).columns;
export const reviews: Article[] = (articles as unknown as ArticlesJson).reviews;
export const readers: Article[] = readersData as unknown as Article[];
