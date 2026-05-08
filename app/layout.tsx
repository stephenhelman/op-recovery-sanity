import type { Metadata } from 'next';
import {
  Black_Ops_One,
  Barlow_Condensed,
  Playfair_Display,
  DM_Sans,
  Syne,
  Inter,
  DM_Serif_Display,
  Nunito,
} from 'next/font/google';
import './globals.css';

const blackOpsOne = Black_Ops_One({ subsets: ['latin'], weight: '400', variable: '--google-black-ops-one' });
const barlowCondensed = Barlow_Condensed({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--google-barlow-condensed' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--google-playfair-display' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--google-dm-sans' });
const syne = Syne({ subsets: ['latin'], variable: '--google-syne' });
const inter = Inter({ subsets: ['latin'], variable: '--google-inter' });
const dmSerifDisplay = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--google-dm-serif-display' });
const nunito = Nunito({ subsets: ['latin'], variable: '--google-nunito' });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Surplus Funds Recovery',
  description: 'We identify unclaimed surplus funds and guide you through the claims process — nationwide, at no upfront cost.',
  openGraph: {
    title: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Surplus Funds Recovery',
    description: 'We identify unclaimed surplus funds and guide you through the claims process — nationwide, at no upfront cost.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontClasses = [
    blackOpsOne.variable,
    barlowCondensed.variable,
    playfairDisplay.variable,
    dmSans.variable,
    syne.variable,
    inter.variable,
    dmSerifDisplay.variable,
    nunito.variable,
  ].join(' ');

  return (
    <html lang="en">
      <body className={`${fontClasses} antialiased`}>
        {children}
      </body>
    </html>
  );
}
