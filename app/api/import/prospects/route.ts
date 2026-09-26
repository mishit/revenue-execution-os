import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

const OWNER_ID = '00000000-0000-0000-0000-000000000001';

type ImportedProspect = {
  firstName?: string; lastName?: string; fullName?: string; title?: string; company?: string;
  industry?: string; employees?: string; location?: string; linkedinUrl?: string;
  headline?: string; verdict?: string; signal?: string; priority?: string;
};

export async function POST(request: Request) {
  const expected = process.env.PRIVATE_ACCESS_TOKEN;
  if (!expected || request.headers.get('x-private-access-token') !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json() as { prospects?: ImportedProspect[] };
    const rows = (body.prospects || []).filter(item => item.fullName || item.firstName || item.linkedinUrl);
    if (!rows.length) return NextResponse.json({ ok: false, error: 'No prospects supplied' }, { status: 400 });
    const supabase = getSupabaseServerClient();
    const companyNames = [...new Set(rows.map(row => row.company).filter(Boolean))] as string[];
    const { data: companies, error: companyError } = await supabase.from('companies').upsert(companyNames.map(name => ({ name })), { onConflict: 'name' }).select('id,name');
    if (companyError) throw companyError;
    const companyMap = new Map((companies || []).map(company => [company.name, company.id]));
    const prospects = rows.map(row => ({ owner_id: OWNER_ID, first_name: row.firstName || null, last_name: row.lastName || null, full_name: row.fullName || [row.firstName, row.lastName].filter(Boolean).join(' '), company_id: row.company ? companyMap.get(row.company) || null : null, title: row.title || null, linkedin_url: row.linkedinUrl || null, industry: row.industry || null, location: row.location || null, source: 'Open-Profile-PITCH-MAYBE.xlsx', notes: [row.headline, row.signal, row.verdict, row.priority].filter(Boolean).join(' | ') || null }));
    const { data, error } = await supabase.from('prospects').upsert(prospects, { onConflict: 'owner_id,linkedin_url' }).select('id');
    if (error) throw error;
    return NextResponse.json({ ok: true, imported: data?.length || 0 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Import failed' }, { status: 500 });
  }
}
