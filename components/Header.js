import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-line/60">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display font-bold text-xl tracking-tight text-ink">
            {"<"}
            <span className="text-copperbright">Bit</span>
            <span className="text-signal">Core</span>
            {"/>"}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-mono text-muted">
          <Link href="/" className="hover:text-ink transition-colors">
            posts
          </Link>
          <Link href="/admin/login" className="hover:text-ink transition-colors">
            admin
          </Link>
        </nav>
      </div>
      <div className="trace max-w-5xl mx-auto" />
    </header>
  );
}
