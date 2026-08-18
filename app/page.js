import Header from "@/components/Header";
import PostCard from "@/components/PostCard";
import { createClient } from "@/lib/supabaseServer";
import { getPublishedPosts } from "@/lib/posts";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();
  const posts = await getPublishedPosts(supabase).catch(() => []);

  return (
    <>
      <Header />
      <section className="relative overflow-hidden">
        <div className="bg-circuit absolute inset-0 h-72 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-14 relative">
          <p className="font-mono text-signal text-sm mb-3">// registro de estudos</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink max-w-2xl leading-tight">
            Anotações e artigos sobre redes, sistemas e infraestrutura.
          </h1>
          <div className="trace w-40 mt-8" />
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <div className="border border-dashed border-line rounded-lg p-12 text-center">
            <p className="font-mono text-muted">
              nenhum post publicado ainda — volte em breve.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
