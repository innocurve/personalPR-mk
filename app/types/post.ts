import { Language } from '../utils/translations'

export interface PostData {
  id: number;
  title: {
    ko: string;
    en: string;
    ja: string;
    zh: string;
  };
  date: string;
  image: string;
  description: {
    ko: string;
    en: string;
    ja: string;
    zh: string;
  };
  tags?: string[];
  content?: { [key in Language]: string };
  gallery?: Array<{
    id: number;
    image: string;
    title: { [key in Language]: string };
    description: { [key in Language]: string };
    content: { [key in Language]: string };
  }>;
} 