import { NextResponse } from 'next/server';
import { getAuditLog } from '@/lib/data';
import { isAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await getAuditLog());
}
