import Link from "next/link";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PostCard({ post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="card-trace block bg-surface border border-line/70 rounded-lg p-6 pl-8 hover:border-copper/60 transition-colors"
    >
      <p className="font-mono text-xs text-muted mb-2">{formatDate(post.created_at)}</p>
      <h2 className="font-display text-xl font-semibold text-ink mb-2">{post.title}</h2>
      {post.excerpt && (
        <p className="text-muted text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
      )}
      <span className="inline-block mt-4 text-signal text-sm font-mono">ler mais →</span>
    </Link>
  );
}
