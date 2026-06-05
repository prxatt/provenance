import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import AdminPanel from '@/app/admin/panel';
import { getAdminAllowlist, isAdminEmail } from '@/lib/auth';
import { getClerkSessionEmail } from '@/lib/clerk-session';

export default async function StudioPage() {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasClerk = Boolean(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const allowlist = getAdminAllowlist();

  if (hasClerk && isProduction) {
    if (allowlist.length === 0) {
      return (
        <main className="container-lux py-32">
          <p className="kicker">Studio locked</p>
          <h1 className="h2 mt-4">Allowlist not configured.</h1>
          <p className="body mt-4 max-w-lg">Set ADMIN_ALLOWLIST_EMAILS before opening the studio in production.</p>
        </main>
      );
    }

    const session = await auth();
    if (!session.userId) {
      return (
        <main className="flex min-h-screen items-center justify-center px-6 py-24">
          <SignIn routing="hash" signUpUrl={undefined} />
        </main>
      );
    }

    const email = await getClerkSessionEmail();
    if (!email || !isAdminEmail(email)) {
      return (
        <main className="container-lux py-32">
          <p className="kicker">Forbidden</p>
          <h1 className="h2 mt-4">This studio is allowlist-only.</h1>
          <p className="body mt-4 max-w-lg">Your account is not authorized for PROVENANCE studio access.</p>
        </main>
      );
    }

    return (
      <main className="pt-28">
        <AdminPanel clerkMode />
      </main>
    );
  }

  if (hasClerk && !isProduction) {
    const session = await auth();
    if (session.userId) {
      const email = await getClerkSessionEmail();
      if (email && isAdminEmail(email)) {
        return (
          <main className="pt-28">
            <AdminPanel clerkMode />
          </main>
        );
      }
    }

    return (
      <main className="pt-28">
        <AdminPanel clerkMode={false} />
      </main>
    );
  }

  if (isProduction) {
    return (
      <main className="container-lux py-32">
        <p className="kicker">Studio locked</p>
        <h1 className="h2 mt-4">Clerk authentication is required in production.</h1>
        <p className="body mt-4 max-w-lg">Configure Clerk keys and ADMIN_ALLOWLIST_EMAILS before using the studio.</p>
      </main>
    );
  }

  return (
    <main className="pt-28">
      <AdminPanel clerkMode={false} />
    </main>
  );
}
