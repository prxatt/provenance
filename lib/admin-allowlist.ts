export function getAdminAllowlist(): string[] {
  return (process.env.ADMIN_ALLOWLIST_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
