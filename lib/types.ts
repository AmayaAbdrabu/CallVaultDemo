export type CallRecord = {
  id: string;
  title: string;
  client_name: string;
  representative: string;
  status: string;
  recorded_at: string;
  duration_seconds: number;
};

export type TranscriptSegment = {
  id: string;
  call_id: string;
  speaker_label: string;
  start_time: number;
  end_time: number;
  content: string;
};

export type CallInsight = {
  call_id: string;
  talk_ratios: Record<string, number>;
  longest_monologue: number;
  question_count: number;
  summary: string;
  action_items: string;
  next_steps: string;
  key_moments: { timestamp: number; label: string; note?: string }[];
};
