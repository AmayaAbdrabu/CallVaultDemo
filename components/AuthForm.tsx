"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase.types";

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(" ");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Magic link sent. Check your inbox.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="card" style={{ maxWidth: 420 }}>
      <h3>Request login link</h3>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send magic link</button>
      <p style={{ color: "#94a3b8" }}>{message}</p>
    </form>
  );
}
