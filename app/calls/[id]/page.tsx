import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { demoCalls, demoInsights, demoSegments, isDemoMode } from "@/lib/demoData";

interface Props {
  params: { id: string };
}

export default async function CallDetailPage({ params }: Props) {
  const { id } = params;

  if (isDemoMode()) {
    const call = demoCalls.find((c) => c.id === id);
    if (!call) return notFound();
    const segments = demoSegments.filter((seg) => seg.call_id === id);
    const insight = demoInsights.find((ins) => ins.call_id === id);
    return <CallView call={call} segments={segments} insight={insight} />;
  }

  const supabase = getSupabaseServerClient();
  const { data: call } = await supabase.from("calls").select("*").eq("id", id).single();
  if (!call) return notFound();
  const { data: segments } = await supabase
    .from("transcript_segments")
    .select("*")
    .eq("call_id", id)
    .order("start_time", { ascending: true });
  const { data: insight } = await supabase.from("call_insights").select("*").eq("call_id", id).maybeSingle();

  return <CallView call={call} segments={segments || []} insight={insight} />;
}

function CallView({ call, segments, insight }: { call: any; segments: any[]; insight: any }) {
  return (
    <div className="card">
      <h2>{call.title}</h2>
      <p>
        {call.client_name} • {call.representative}
      </p>
      <audio controls src="/samples/demo_call.wav" style={{ width: "100%", margin: "1rem 0" }} />
      {insight && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div>
            <h4>Talk Ratio</h4>
            <pre>{JSON.stringify(insight.talk_ratios, null, 2)}</pre>
          </div>
          <div>
            <h4>Summary</h4>
            <p>{insight.summary}</p>
          </div>
          <div>
            <h4>Action Items</h4>
            <pre>{insight.action_items}</pre>
          </div>
          <div>
            <h4>Next Steps</h4>
            <pre>{insight.next_steps}</pre>
          </div>
        </div>
      )}
      <section>
        <h3>Transcript</h3>
        <div className="transcript">
          {segments.map((segment) => (
            <p key={segment.id}>
              <strong>{segment.speaker_label}</strong> [{segment.start_time}s]: {segment.content}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
