export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      calls: {
        Row: {
          id: string;
          title: string;
          client_name: string;
          representative: string;
          status: string;
          recorded_at: string;
          duration_seconds: number;
          storage_path: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          client_name: string;
          representative: string;
          status?: string;
          recorded_at?: string;
          duration_seconds?: number;
          storage_path?: string | null;
          created_by?: string | null;
        };
      };
      transcript_segments: {
        Row: {
          id: string;
          call_id: string;
          speaker_label: string;
          start_time: number;
          end_time: number;
          content: string;
        };
        Insert: {
          id?: string;
          call_id: string;
          speaker_label: string;
          start_time: number;
          end_time: number;
          content: string;
        };
      };
      call_insights: {
        Row: {
          call_id: string;
          talk_ratios: Json;
          longest_monologue: number;
          question_count: number;
          summary: string;
          action_items: string;
          next_steps: string;
          key_moments: Json;
        };
        Insert: {
          call_id: string;
          talk_ratios?: Json;
          longest_monologue?: number;
          question_count?: number;
          summary?: string;
          action_items?: string;
          next_steps?: string;
          key_moments?: Json;
        };
      };
    };
  };
};
