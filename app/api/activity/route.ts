import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

const OWNER_ID = '00000000-0000-0000-0000-000000000001';

export async function POST(request: Request) {
  const expected = process.env.PRIVATE_ACCESS_TOKEN;
  if (!expected || request.headers.get('x-private-access-token') !== expected) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json() as { prospectId?: number; eventType?: string; occurredAt?: string; metadata?: Record<string, unknown> };
    if (!body.eventType) return NextResponse.json({ ok: false, error: 'eventType is required' }, { status: 400 });
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from('activity_logs').insert({ owner_id: OWNER_ID, prospect_id: body.prospectId || null, event_type: body.eventType, occurred_at: body.occurredAt || new Date().toISOString(), metadata: body.metadata || {} }).select('id').single();
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
    return NextResponse.json({ ok: true, activity: data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Activity save failed' }, { status: 500 });
  }
}
