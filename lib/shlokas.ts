export interface Shloka {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  meaning_en: string;
  meaning_hi: string;
  keywords_en: string[];
  keywords_hi: string[];
  theme: string;
}

import verses from '../verses.json';

export const shlokas: Shloka[] = verses as Shloka[];
