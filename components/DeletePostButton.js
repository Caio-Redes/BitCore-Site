"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

export default function DeletePostButton({ postId, postTitle }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      `Excluir o post "${postTitle}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmed) return;

    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }
    router.refresh();
  }

  return (
    <button onClick={handleDelete} className="text-muted hover:text-danger">
      excluir
    </button>
  );
}
