import slugify from "slugify";

export function slugFromTitle(title) {
  const base = slugify(title, { lower: true, strict: true, locale: "pt" });
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export async function getPublishedPosts(supabase) {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_url, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllPostsForAdmin(supabase) {
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_url, published, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPostBySlug(supabase, slug) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getPostById(supabase, id) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}
