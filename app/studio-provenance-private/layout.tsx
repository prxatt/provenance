import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio — PROVENANCE',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-admin-studio className="min-h-screen bg-black">
      {children}
    </div>
  );
}
