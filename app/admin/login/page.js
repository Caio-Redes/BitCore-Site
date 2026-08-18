"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError("E-mail ou senha incorretos.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg text-ink block mb-8 text-center">
          {"<"}
          <span className="text-copperbright">Bit</span>
          <span className="text-signal">Core</span>
          {"/>"}
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-line rounded-lg p-8 space-y-4"
        >
          <h1 className="font-mono text-sm text-muted mb-2">acesso administrativo</h1>

          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">e-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface2 border border-line rounded px-3 py-2 text-ink focus:border-signal outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface2 border border-line rounded px-3 py-2 text-ink focus:border-signal outline-none"
            />
          </div>

          {error && <p className="text-danger text-sm font-mono">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-copper hover:bg-copperbright text-backdrop font-semibold rounded py-2.5 transition-colors disabled:opacity-50"
          >
            {loading ? "entrando..." : "entrar"}
          </button>
        </form>
        <p className="text-center text-muted text-xs font-mono mt-4">
          <Link href="/" className="hover:text-ink">
            ← voltar para o site
          </Link>
        </p>
      </div>
    </main>
  );
}
