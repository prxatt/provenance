import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const hasClerk = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);

function adminNotFound(pathname: string) {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse(null, { status: 404 });
  }
  return null;
}

async function passthrough(req: NextRequest) {
  const blocked = adminNotFound(req.nextUrl.pathname);
  if (blocked) return blocked;
  return NextResponse.next();
}

/** Clerk proxy only when keys are configured — otherwise storefront must not 500 on missing publishableKey. */
export default hasClerk
  ? clerkMiddleware(async (_auth, req) => {
      const blocked = adminNotFound(req.nextUrl.pathname);
      if (blocked) return blocked;
      return NextResponse.next();
    })
  : passthrough;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
