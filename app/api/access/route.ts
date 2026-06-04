import {NextResponse} from 'next/server';import {z} from 'zod';import {addAccessRequest,getAccessRequests} from '@/lib/data';import {isAdmin} from '@/lib/auth';
const Schema=z.object({email:z.string().email(),name:z.string().optional(),interest:z.string().optional()});
export async function POST(req:Request){const parsed=Schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Invalid request'}, {status:400});return NextResponse.json(await addAccessRequest(parsed.data))}
export async function GET(req:Request){if(!isAdmin(req))return NextResponse.json({error:'Unauthorized'},{status:401});return NextResponse.json(await getAccessRequests())}
