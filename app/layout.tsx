import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
const serif=Cormorant_Garamond({subsets:['latin'],weight:['300','400','500','600'],variable:'--font-serif'});const sans=Montserrat({subsets:['latin'],weight:['300','400','500','600','700'],variable:'--font-sans'});
export const metadata:Metadata={title:'PROVENANCE — Objects with history',description:'Curated watches and jewelry with verified origin. A Surface Tension Company.',metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000')};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>
        <Providers />
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
