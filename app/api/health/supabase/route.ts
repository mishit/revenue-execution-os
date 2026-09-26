import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('campaigns').select('id').limit(1);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
    return NextResponse.json({ ok: true, service: 'supabase' });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Configuration error' }, { status: 500 });
  }
}
