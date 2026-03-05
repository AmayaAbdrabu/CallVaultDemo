create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_name text not null,
  representative text not null,
  status text not null default 'pending',
  recorded_at timestamptz not null default now(),
  duration_seconds integer not null default 0,
  storage_path text,
  created_by uuid references auth.users(id),
  inserted_at timestamptz default now()
);

create table if not exists public.transcript_segments (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references public.calls(id) on delete cascade,
  speaker_label text not null,
  start_time numeric not null,
  end_time numeric not null,
  content text not null,
  inserted_at timestamptz default now()
);

create index if not exists transcript_segments_call_id_idx on public.transcript_segments(call_id);
create index if not exists transcript_segments_content_idx on public.transcript_segments using gin (to_tsvector('english', content));

create table if not exists public.call_insights (
  call_id uuid primary key references public.calls(id) on delete cascade,
  talk_ratios jsonb,
  longest_monologue integer,
  question_count integer,
  summary text,
  action_items text,
  next_steps text,
  key_moments jsonb,
  inserted_at timestamptz default now()
);
