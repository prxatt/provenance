import { auth, currentUser } from '@clerk/nextjs/server';

type Claims = Record<string, unknown> | null | undefined;

/** Clerk JWTs omit email unless a custom session claim is configured — resolve from claims then user profile. */
export function emailFromSessionClaims(claims: Claims): string | null {
  if (!claims) return null;

  const direct = [claims.email, claims.primaryEmail, claims.primary_email_address, claims.email_address];
  for (const value of direct) {
    if (typeof value === 'string' && value.includes('@')) return value.toLowerCase();
  }

  const metadata = claims.metadata;
  if (metadata && typeof metadata === 'object' && metadata !== null) {
    const metaEmail = (metadata as Record<string, unknown>).email;
    if (typeof metaEmail === 'string' && metaEmail.includes('@')) return metaEmail.toLowerCase();
  }

  return null;
}

export async function getClerkSessionEmail(): Promise<string | null> {
  try {
    const { sessionClaims, userId } = await auth();
    if (!userId) return null;

    const fromClaims = emailFromSessionClaims(sessionClaims as Claims);
    if (fromClaims) return fromClaims;

    const user = await currentUser();
    const email =
      user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? null;
    return email?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}
