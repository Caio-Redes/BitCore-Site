import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";
import DeletePostButton from "@/components/DeletePostButton";
import { createClient } from "@/lib/supabaseServer";
import { getAllPostsForAdmin } from "@/lib/posts";

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = createClient();
  const posts = await getAllPostsForAdmin(supabase).catch(() => []);

  return (
    <>
      <AdminHeader title="painel" />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold text-ink">Seus posts</h1>
          <Link
            href="/admin/novo"
            className="bg-copper hover:bg-copperbright text-backdrop font-mono text-sm font-semibold rounded px-4 py-2 transition-colors"
          >
            + novo post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="border border-dashed border-line rounded-lg p-12 text-center">
            <p className="font-mono text-muted">
              você ainda não criou nenhum post.
            </p>
          </div>
        ) : (
          <div className="border border-line rounded-lg overflow-hidden">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className={`flex items-center justify-between gap-4 px-5 py-4 ${
                  i !== posts.length - 1 ? "border-b border-line" : ""
                } bg-surface`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        post.published
                          ? "bg-signal/15 text-signal"
                          : "bg-line text-muted"
                      }`}
                    >
                      {post.published ? "publicado" : "rascunho"}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {new Date(post.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-ink font-semibold truncate">{post.title}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 font-mono text-sm">
                  <Link href={`/admin/editar/${post.id}`} className="text-signal hover:text-copperbright">
                    editar
                  </Link>
                  <DeletePostButton postId={post.id} postTitle={post.title} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
