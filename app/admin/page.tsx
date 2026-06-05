import { notFound } from 'next/navigation';

/** Legacy public admin — permanently removed. Use ADMIN_PATH studio route. */
export default function LegacyAdmin() {
  notFound();
}
