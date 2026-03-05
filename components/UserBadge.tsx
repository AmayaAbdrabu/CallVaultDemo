import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export default async function UserBadge() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p style={{ color: "#94a3b8" }}>Not signed in</p>;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span>{user.email}</span>
      <form action="/auth/signout" method="post">
        <button type="submit">Sign out</button>
      </form>
      <Link href="/calls">Library</Link>
    </div>
  );
}
