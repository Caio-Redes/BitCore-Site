"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import Editor from "@/components/Editor";
import { createClient } from "@/lib/supabaseClient";

export default function EditarPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
      if (error || !data) {
        setError("Post não encontrado.");
        setLoading(false);
        return;
      }
      setTitle(data.title);
      setExcerpt(data.excerpt || "");
      setContent(data.content);
      setCoverUrl(data.cover_url);
      setPublished(data.published);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave(publishOverride) {
    setError("");
    setSaving(true);

    const supabase = createClient();
    let newCoverUrl = coverUrl;

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
      newCoverUrl = supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        title,
        excerpt,
        content,
        cover_url: newCoverUrl,
        published: publishOverride !== undefined ? publishOverride : published,
      })
      .eq("id", id);

    setSaving(false);

    if (updateError) {
      setError("Erro ao salvar: " + updateError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (loading) {
    return (
      <>
        <AdminHeader title="editar post" />
        <main className="max-w-3xl mx-auto px-6 py-12">
          <p className="font-mono text-muted">carregando...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="editar post" />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold text-ink">Editar post</h1>
          <span
            className={`text-[10px] font-mono px-2 py-1 rounded ${
              published ? "bg-signal/15 text-signal" : "bg-line text-muted"
            }`}
          >
            {published ? "publicado" : "rascunho"}
          </span>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-muted mb-1.5">título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <label className="block text-xs font-mono text-muted mb-1.5">imagem de capa</label>
            {coverUrl && !coverFile && (
              <img src={coverUrl} alt="capa atual" className="w-40 rounded border border-line mb-2" />
            )}
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
              salvar como rascunho
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-copper hover:bg-copperbright text-backdrop font-mono text-sm font-semibold rounded px-4 py-2.5 transition-colors disabled:opacity-50"
            >
              {saving ? "salvando..." : published ? "salvar alterações" : "publicar"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
