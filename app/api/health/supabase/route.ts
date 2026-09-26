import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) return NextResponse.json({ ok: false, error: 'Missing NEXT_PUBLIC_SUPABASE_URL' }, { status: 500 });
    const candidates = [
      ['SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY],
      ['SUPABASE_SECRET_KEY', process.env.SUPABASE_SECRET_KEY],
      ['SUPABASE_PUBLISHABLE_KEY', process.env.SUPABASE_PUBLISHABLE_KEY],
      ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY],
      ['NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ] as const;
    const results = await Promise.all(candidates.filter(([, key]) => key).map(async ([name, key]) => {
      const response = await fetch(`${url}/rest/v1/campaigns?select=id&limit=1`, { headers: { apikey: key!, Authorization: `Bearer ${key}` }, cache: 'no-store' });
      const body = await response.text();
      return { name, ok: response.ok, status: response.status, error: response.ok ? undefined : body.slice(0, 180) };
    }));
    const working = results.filter(result => result.ok).map(result => result.name);
    if (working.length) return NextResponse.json({ ok: true, service: 'supabase', workingKeys: working, results });
    return NextResponse.json({ ok: false, error: 'No configured Supabase key can read public.campaigns', results }, { status: 502 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Configuration error' }, { status: 500 });
  }
}
