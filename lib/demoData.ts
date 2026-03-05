import type { CallInsight, CallRecord, TranscriptSegment } from "./types";

export const demoCalls: CallRecord[] = [
  {
    id: "demo-1",
    title: "Renewal Strategy",
    client_name: "Northwind Logistics",
    representative: "Ava Singh",
    status: "completed",
    recorded_at: "2026-02-28T04:00:00Z",
    duration_seconds: 1800,
  },
  {
    id: "demo-2",
    title: "Discovery — Fleet Automation",
    client_name: "Alpha Freight",
    representative: "Leo Park",
    status: "completed",
    recorded_at: "2026-03-01T02:30:00Z",
    duration_seconds: 1500,
  },
];

export const demoSegments: TranscriptSegment[] = [
  {
    id: "seg-1",
    call_id: "demo-1",
    speaker_label: "Caller 1",
    start_time: 0,
    end_time: 14,
    content: "Thanks for joining the call, let's confirm renewal scope and budget",
  },
  {
    id: "seg-2",
    call_id: "demo-1",
    speaker_label: "Caller 2",
    start_time: 14,
    end_time: 30,
    content: "We need pricing flexibility and clarity on competitor positioning",
  },
  {
    id: "seg-3",
    call_id: "demo-2",
    speaker_label: "Caller 1",
    start_time: 0,
    end_time: 16,
    content: "Walk me through your current quoting workflow and blockers",
  },
];

export const demoInsights: CallInsight[] = [
  {
    call_id: "demo-1",
    talk_ratios: { "Caller 1": 0.55, "Caller 2": 0.45 },
    longest_monologue: 60,
    question_count: 8,
    summary: "Customer evaluating renewal with pricing pressure; agreed to review tiered plan.",
    action_items: "- Send revised proposal\n- Schedule exec review",
    next_steps: "- Follow up Friday\n- Log decision in CRM",
    key_moments: [{ timestamp: 14, label: "Budget", note: "Customer raised pricing risk" }],
  },
  {
    call_id: "demo-2",
    talk_ratios: { "Caller 1": 0.62, "Caller 2": 0.38 },
    longest_monologue: 42,
    question_count: 5,
    summary: "Discovery call focused on automation backlog and missing follow ups.",
    action_items: "- Share dashboard mock\n- Map data sources",
    next_steps: "- Book workshop\n- Confirm success criteria",
    key_moments: [{ timestamp: 10, label: "Workflow", note: "Manual spreadsheets admitted" }],
  },
];

export const isDemoMode = () => process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL;
