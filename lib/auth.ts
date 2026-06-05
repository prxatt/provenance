import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

export function getAdminAllowlist(): string[] {
  return (process.env.ADMIN_ALLOWLIST_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isDevTokenAdmin(req: Request | NextRequest) {
  const token = req.headers.get('x-admin-token') || '';
  return Boolean(process.env.ADMIN_TOKEN) && token === process.env.ADMIN_TOKEN;
}

export async function getAdminActor(): Promise<string | null> {
  try {
    const session = await auth();
    const email = session.sessionClaims?.email as string | undefined;
    if (email && getAdminAllowlist().includes(email.toLowerCase())) return email;
  } catch {
    /* Clerk not configured */
  }
  return null;
}

export async function isClerkAdmin() {
  const actor = await getAdminActor();
  return Boolean(actor);
}

/** Production: Clerk allowlist. Development: ADMIN_TOKEN header fallback. */
export async function isAdmin(req: Request) {
  if (await isClerkAdmin()) return true;
  if (process.env.NODE_ENV !== 'production' && isDevTokenAdmin(req)) return true;
  return false;
}

export function isAdminEmail(email: string) {
  return getAdminAllowlist().includes(email.trim().toLowerCase());
}
