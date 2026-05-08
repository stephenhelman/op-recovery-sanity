import { FontPairing } from '@/types/content';

export const fontPairings: Record<FontPairing, { heading: string; body: string }> = {
  authority: {
    heading: "'Black Ops One', cursive",
    body: "'Barlow Condensed', sans-serif",
  },
  professional: {
    heading: "'Playfair Display', serif",
    body: "'DM Sans', sans-serif",
  },
  modern: {
    heading: "'Syne', sans-serif",
    body: "'Inter', sans-serif",
  },
  clean: {
    heading: "'DM Serif Display', serif",
    body: "'Nunito', sans-serif",
  },
};
