import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { demoCalls, isDemoMode } from "@/lib/demoData";

export const metadata = { title: "Call Library" };

export default async function CallsPage() {
  let calls = demoCalls;
  if (!isDemoMode()) {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase.from("calls").select("*").order("recorded_at", { ascending: false });
    calls = data || [];
  }

  return (
    <div className="card">
      <h2>Call Library</h2>
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
              <td>
                <Link href={`/calls/${call.id}`}>{call.title}</Link>
              </td>
              <td>{call.client_name}</td>
              <td>{call.representative}</td>
              <td>{call.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
