import { NextResponse } from "next/server";
import { getSupabaseRouteClient } from "@/lib/supabase-server";
import { demoCalls, demoInsights, demoSegments, isDemoMode } from "@/lib/demoData";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (isDemoMode()) {
    const call = demoCalls.find((c) => c.id === id);
    if (!call) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      call,
      segments: demoSegments.filter((seg) => seg.call_id === id),
      insight: demoInsights.find((ins) => ins.call_id === id) ?? null,
    });
  }

  const supabase = getSupabaseRouteClient();
  const { data: call, error } = await supabase.from("calls").select("*").eq("id", id).single();
  if (error || !call) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data: segments } = await supabase
    .from("transcript_segments")
    .select("*")
    .eq("call_id", id)
    .order("start_time", { ascending: true });
  const { data: insight } = await supabase.from("call_insights").select("*").eq("call_id", id).maybeSingle();

  return NextResponse.json({ call, segments, insight });
}
