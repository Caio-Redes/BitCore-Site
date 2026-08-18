"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import Editor from "@/components/Editor";
import { createClient } from "@/lib/supabaseClient";
import { slugFromTitle } from "@/lib/posts";

export default function NovoPostPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSave(publish) {
    if (!title.trim()) {
      setError("Dê um título ao post antes de salvar.");
      return;
    }
    setError("");
    setSaving(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let coverUrl = null;
    if (coverFile) {
      const path = `covers/${Date.now()}-${coverFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, coverFile);
      if (uploadError) {
        setError("Erro ao enviar imagem de capa: " + uploadError.message);
        setSaving(false);
        return;
      }
      coverUrl = supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("posts")
      .insert({
        title,
        slug: slugFromTitle(title),
        excerpt,
        content,
        cover_url: coverUrl,
        published: publish,
        author_id: user?.id,
      })
      .select()
      .single();

    setSaving(false);

    if (insertError) {
      setError("Erro ao salvar: " + insertError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <>
      <AdminHeader title="novo post" />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-2xl font-bold text-ink mb-8">Novo post</h1>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Servidor DNS Recursivo com BIND 9"
              className="w-full bg-surface border border-line rounded px-3 py-2.5 text-ink text-lg focus:border-signal outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">
              resumo (aparece na listagem)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full bg-surface border border-line rounded px-3 py-2.5 text-ink focus:border-signal outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">
              imagem de capa (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              className="text-sm font-mono text-muted"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">conteúdo</label>
            <Editor content={content} onChange={setContent} />
          </div>

          {error && <p className="text-danger text-sm font-mono">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="bg-surface2 border border-line hover:border-copper/60 text-ink font-mono text-sm rounded px-4 py-2.5 transition-colors disabled:opacity-50"
            >
              salvar rascunho
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-copper hover:bg-copperbright text-backdrop font-mono text-sm font-semibold rounded px-4 py-2.5 transition-colors disabled:opacity-50"
            >
              {saving ? "publicando..." : "publicar"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
