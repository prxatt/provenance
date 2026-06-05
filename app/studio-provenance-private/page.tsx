import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import AdminPanel from '@/app/admin/panel';
import { isAdminEmail } from '@/lib/auth';

export default async function StudioPage() {
  const hasClerk = Boolean(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (hasClerk) {
    const session = await auth();
    const email = session.sessionClaims?.email as string | undefined;
    if (!session.userId) {
      return (
        <main className="flex min-h-screen items-center justify-center px-6 py-24">
          <SignIn routing="hash" signUpUrl={undefined} />
        </main>
      );
    }
    if (!email || !isAdminEmail(email)) {
      return (
        <main className="container-lux py-32">
          <p className="kicker">Forbidden</p>
          <h1 className="h2 mt-4">This studio is allowlist-only.</h1>
          <p className="body mt-4 max-w-lg">Your account is not authorized for PROVENANCE studio access.</p>
        </main>
      );
    }
  } else if (process.env.NODE_ENV === 'production') {
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
      <AdminPanel clerkMode={hasClerk} />
    </main>
  );
}
