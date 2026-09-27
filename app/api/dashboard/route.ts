import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

const OWNER_ID = '00000000-0000-0000-0000-000000000001';

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const [{ data: prospects, error: prospectError }, { data: campaigns, error: campaignError }, { data: activities, error: activityError }] = await Promise.all([
      supabase.from('prospects').select('id,full_name,title,industry,location,linkedin_url,companies(name),campaign_members(status,next_action_at,next_action_type,priority_score)').eq('owner_id', OWNER_ID).order('created_at', { ascending: false }),
      supabase.from('campaigns').select('id,name,description,icp,offer,channel,status,daily_outreach_target,daily_followup_target').eq('owner_id', OWNER_ID).order('created_at'),
      supabase.from('activity_logs').select('id,event_type,occurred_at,metadata,prospect_id').eq('owner_id', OWNER_ID).order('occurred_at', { ascending: false }).limit(200),
    ]);
    const error = prospectError || campaignError || activityError;
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
    return NextResponse.json({ ok: true, prospects: prospects || [], campaigns: campaigns || [], activities: activities || [] });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Dashboard load failed' }, { status: 500 });
  }
}
