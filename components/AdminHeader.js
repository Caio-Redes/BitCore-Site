"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function AdminHeader({ title }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-line/60">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-display text-lg text-ink">
            {"<"}
            <span className="text-copperbright">Bit</span>
            <span className="text-signal">Core</span>
            {"/>"}
          </Link>
          <span className="font-mono text-xs text-muted hidden sm:inline">{title}</span>
        </div>
        <nav className="flex items-center gap-4 text-sm font-mono">
          <Link href="/admin/novo" className="text-signal hover:text-copperbright transition-colors">
            + novo post
          </Link>
          <Link href="/" target="_blank" className="text-muted hover:text-ink transition-colors">
            ver site
          </Link>
          <button onClick={handleLogout} className="text-muted hover:text-danger transition-colors">
            sair
          </button>
        </nav>
      </div>
      <div className="trace max-w-5xl mx-auto" />
    </header>
  );
}
