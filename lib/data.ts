import articles from "@/lib/articles.json";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string; // "08 Feb 2026"
  category: string;
  image: string;
  content: string[];
}

type ArticlesJson = { columns: Article[]; reviews: Article[] };

export const columns: Article[] = (articles as unknown as ArticlesJson).columns;
export const reviews: Article[] = (articles as unknown as ArticlesJson).reviews;

