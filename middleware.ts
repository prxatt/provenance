import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const adminInternal = createRouteMatcher(['/studio-provenance-private(.*)']);

function adminPublicPath() {
  const path = process.env.ADMIN_PATH || '/_studio-provenance-private';
  return path.replace(/\/$/, '');
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const publicAdmin = adminPublicPath();

  // Block legacy public admin route entirely
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse(null, { status: 404 });
  }

  const isAdminRoute = pathname === publicAdmin || pathname.startsWith(`${publicAdmin}/`) || adminInternal(req);

  if (!isAdminRoute) return NextResponse.next();

  const allowlist = (process.env.ADMIN_ALLOWLIST_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const hasClerk = Boolean(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (hasClerk && allowlist.length > 0) {
    await auth.protect();
    const { sessionClaims } = await auth();
    const email = (sessionClaims?.email as string | undefined)?.toLowerCase();
    if (!email || !allowlist.includes(email)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return res;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
