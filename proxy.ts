import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function adminPublicPath() {
  return (process.env.ADMIN_PATH || '/_studio-provenance-private').replace(/\/$/, '');
}

/** Node.js proxy (Next.js 16+) — blocks legacy /admin, sets noindex on studio routes. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicAdmin = adminPublicPath();

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse(null, { status: 404 });
  }

  const isStudio =
    pathname === '/studio-provenance-private' ||
    pathname.startsWith('/studio-provenance-private/') ||
    pathname === publicAdmin ||
    pathname.startsWith(`${publicAdmin}/`);

  if (isStudio) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
