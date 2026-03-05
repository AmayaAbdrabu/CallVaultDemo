import AuthForm from "@/components/AuthForm";
import UserBadge from "@/components/UserBadge";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { demoCalls, isDemoMode } from "@/lib/demoData";
import Link from "next/link";

export default async function HomePage() {
  let calls = demoCalls;

  if (!isDemoMode()) {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase.from("calls").select("*").order("recorded_at", { ascending: false }).limit(5);
    calls = data || [];
  }

  return (
    <div>
      <div className="card" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h2>Pipeline visibility in minutes</h2>
          <p>Upload recordings to Supabase Storage, let the worker fill transcripts + insights, and share the CallVault library.</p>
          <UserBadge />
          <div style={{ marginTop: "1rem" }}>
            <Link href="/calls" style={{ textDecoration: "underline" }}>
              Go to call library →
            </Link>
          </div>
        </div>
        <AuthForm />
      </div>

      <div className="card">
        <h3>Recent calls</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Client</th>
              <th>Rep</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.id}>
                <td>{call.title}</td>
                <td>{call.client_name}</td>
                <td>{call.representative}</td>
                <td>{call.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
