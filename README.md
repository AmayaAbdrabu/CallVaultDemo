# CallVault — Next.js + Supabase (Vercel-ready)

Production-ready blueprint for a Gong-style call library running on Vercel (Next.js App Router) with Supabase Auth, Postgres, Storage, and serverless APIs.

## Features
- Supabase Auth email magic-link login + session helpers.
- Upload workflow writes metadata via `/api/calls/create` and returns signed upload URL for Storage bucket `calls`.
- Processing webhook `/api/calls/process` (service role) stores diarized transcript segments + insights.
- API surface for fetching a call (`/api/calls/[id]`) and transcript search (`/api/search?q=`).
- App Router pages: landing, call library, call detail with transcript + coaching insights.
- Demo mode fallback (set `NEXT_PUBLIC_DEMO_MODE=true`) seeds sample calls without Supabase.
- SQL migration + schema for Supabase Database + Storage bucket instructions.

## 1. Supabase Setup
1. Create a new Supabase project.
2. Run the SQL migration:
   ```bash
   supabase db push --file supabase/migrations/0001_create_tables.sql
   ```
   or paste the file into the Supabase SQL editor and execute.
3. Storage bucket: in Supabase Storage create a bucket named `calls` (public = false). Under **Policies**, add an insert policy allowing authenticated users to upload and a select policy allowing authenticated users to read their own files.
4. Copy the project URL, anon key, and service-role key from Settings → API.

## 2. Vercel Deployment
1. Fork/copy this repo.
2. In Vercel, create a new project, import the repo, and set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (marked as encrypted)
   - `NEXT_PUBLIC_SITE_URL` (e.g., `https://callvault.yourdomain.com`)
   - `NEXT_PUBLIC_DEMO_MODE=false` for production (true if you want seeded demo data without Supabase)
3. Push to main; Vercel handles `npm install && next build`.

## 3. Local Development (optional)
```bash
npm install
cp .env.example .env.local
npm run dev
```
Visit `http://localhost:3000`. With `NEXT_PUBLIC_DEMO_MODE=true`, the library uses local demo data; set it to `false` and supply Supabase keys to work against your DB.

## 4. API Contracts
- `POST /api/calls/create` — body `{ title, clientName, representative }`; returns `{ id, uploadUrl, path }`. Auth required.
- `POST /api/calls/process` — service-only route; body `{ callId, segments: [...], insight, duration }`; updates DB.
- `GET /api/calls/:id` — returns `{ call, segments, insight }`.
- `GET /api/search?q=` — full-text search over transcript segments.

## 5. Auth Flow
- `components/AuthForm` sends Supabase magic links for email login.
- `components/UserBadge` shows current user and sign-out button (POST `/auth/signout`).

## 6. Demo Mode
Set `NEXT_PUBLIC_DEMO_MODE=true` (default in `.env.example`). App bypasses Supabase and renders seeded calls/transcripts/insights from `lib/demoData.ts`. Useful for product demos or staging without live infra.

## 7. Processing Worker
- After a file is uploaded to Storage, trigger your transcription worker (e.g., via Supabase Function, Edge Function, or n8n). When finished, POST to `/api/calls/process` with diarized segments + insight payload to persist results.

## 8. Storage Paths
- `/api/calls/create` generates a signed upload URL for path `calls/{callId}/{callId}.wav`. Use standard `fetch PUT` with the signed URL to upload from the browser.

## 9. Schema Reference
Tables live under `public` schema:
- `calls` — metadata + status per recording.
- `transcript_segments` — diarized transcript chunks, indexed for `ILIKE`/`tsvector` search.
- `call_insights` — aggregated analytics (talk ratio, summary, key moments).

## 10. Environment Variables Summary
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key for `/api/calls/process` |
| `NEXT_PUBLIC_SITE_URL` | Used for redirects (sign-out) |
| `NEXT_PUBLIC_DEMO_MODE` | `true` to bypass Supabase and use demo data |

Deploy this to Vercel + Supabase and you have a working CallVault MVP without Docker.
