import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "CallVault",
  description: "Call intelligence demo for Vercel + Supabase",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="main-wrap">
          <header style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "2.2rem", margin: 0 }}>CallVault</h1>
            <p style={{ color: "#94a3b8" }}>Next.js + Supabase call intelligence demo</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
