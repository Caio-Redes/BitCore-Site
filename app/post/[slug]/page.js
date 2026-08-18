import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabaseServer";
import { getPostBySlug } from "@/lib/posts";
import { contentToHtml } from "@/lib/renderContent";

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const supabase = createClient();
  const post = await getPostBySlug(supabase, params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — BitCore`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }) {
  const supabase = createClient();
  const post = await getPostBySlug(supabase, params.slug);

  if (!post || !post.published) notFound();

  const html = contentToHtml(post.content);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-14">
        <p className="font-mono text-xs text-muted mb-3">
          {new Date(post.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6">
          {post.title}
        </h1>
        <div className="trace w-24 mb-10" />
        {post.cover_url && (
          <img
            src={post.cover_url}
            alt={post.title}
            className="w-full rounded-lg border border-line mb-10"
          />
        )}
        <div className="prose-bitcore" dangerouslySetInnerHTML={{ __html: html }} />
      </main>
    </>
  );
}
