import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseServiceRole } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demoData";

export async function POST(request: Request) {
  if (isDemoMode()) {
    return NextResponse.json({ status: "demo", message: "Processing simulated" });
  }
  const serviceClient = getSupabaseServiceRole();
  const body = await request.json();
  const { callId, segments = [], insight } = body;

  await serviceClient.from("calls").update({ status: "completed", duration_seconds: body.duration || 0 }).eq("id", callId);

  if (segments.length) {
    const rows = segments.map((segment: any) => ({
      id: randomUUID(),
      call_id: callId,
      speaker_label: segment.speaker_label,
      start_time: segment.start_time,
      end_time: segment.end_time,
      content: segment.content,
    }));
    await serviceClient.from("transcript_segments").insert(rows);
  }

  if (insight) {
    await serviceClient.from("call_insights").upsert({
      call_id: callId,
      talk_ratios: insight.talk_ratios,
      longest_monologue: insight.longest_monologue,
      question_count: insight.question_count,
      summary: insight.summary,
      action_items: insight.action_items,
      next_steps: insight.next_steps,
      key_moments: insight.key_moments,
    });
  }

  return NextResponse.json({ status: "ok" });
}
