import { Language } from '../utils/translations'

export interface PostData {
  id: number;
  title: { [key in Language]: string };
  date: string;
  hit: number;
  image: string;
  description: { [key in Language]: string };
  content?: { [key in Language]: string };
  gallery?: Array<{
    id: number;
    image: string;
    title: { [key in Language]: string };
    description: { [key in Language]: string };
    content: { [key in Language]: string };
  }>;
} 