import { NextResponse } from "next/server";
import { getSupabaseRouteClient } from "@/lib/supabase-server";
import { demoSegments, isDemoMode } from "@/lib/demoData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  if (!query) return NextResponse.json({ results: [] });

  if (isDemoMode()) {
    const results = demoSegments
      .filter((seg) => seg.content.toLowerCase().includes(query.toLowerCase()))
      .map((seg) => ({
        call_id: seg.call_id,
        snippet: seg.content,
        timestamp: seg.start_time,
      }));
    return NextResponse.json({ results });
  }

  const supabase = getSupabaseRouteClient();
  const { data, error } = await supabase
    .from("transcript_segments")
    .select("call_id, content, start_time")
    .ilike("content", `%${query}%`)
    .limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({
    results: data?.map((row) => ({ call_id: row.call_id, snippet: row.content, timestamp: row.start_time })) || [],
  });
}
