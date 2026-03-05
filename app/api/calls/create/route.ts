import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseRouteClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/demoData";

export async function POST(request: Request) {
  if (isDemoMode()) {
    return NextResponse.json({ id: `demo-${Date.now()}`, uploadUrl: "/samples/demo_call.wav" });
  }
  const supabase = getSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const id = randomUUID();
  const { error } = await supabase.from("calls").insert({
    id,
    title: body.title,
    client_name: body.clientName,
    representative: body.representative,
    status: "uploaded",
    created_by: user.id,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const path = `${id}/${id}.wav`;
  const { data: signed, error: storageError } = await supabase.storage.from("calls").createSignedUploadUrl(path);
  if (storageError || !signed) return NextResponse.json({ error: storageError?.message }, { status: 500 });

  return NextResponse.json({ id, uploadUrl: signed.signedUrl, path });
}
