"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import { useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

const lowlight = createLowlight(common);

function ToolbarButton({ onClick, active, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded text-sm font-mono border transition-colors ${
        active
          ? "bg-copper/20 border-copper text-copperbright"
          : "bg-surface2 border-line text-muted hover:text-ink hover:border-copper/60"
      }`}
    >
      {children}
    </button>
  );
}

export default function Editor({ content, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "prose-bitcore min-h-[320px] focus:outline-none px-4 py-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) return null;

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const supabase = createClient();
    const path = `posts/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("post-images").upload(path, file);
    if (error) {
      alert("Erro ao enviar imagem: " + error.message);
      return;
    }
    const { data } = supabase.storage.from("post-images").getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl }).run();
    e.target.value = "";
  }

  return (
    <div className="border border-line rounded-lg bg-surface overflow-hidden">
      <div className="flex flex-wrap gap-2 p-3 border-b border-line bg-surface2">
        <ToolbarButton
          title="Negrito"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          title="Itálico"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          title="Título"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Subtítulo"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          title="Lista"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • lista
        </ToolbarButton>
        <ToolbarButton
          title="Lista numerada"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. lista
        </ToolbarButton>
        <ToolbarButton
          title="Citação"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          "citação"
        </ToolbarButton>
        <ToolbarButton
          title="Bloco de código"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {"</>"}
        </ToolbarButton>
        <ToolbarButton
          title="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("URL do link:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          link
        </ToolbarButton>
        <label
          title="Imagem"
          className="px-2.5 py-1.5 rounded text-sm font-mono border bg-surface2 border-line text-muted hover:text-ink hover:border-copper/60 cursor-pointer"
        >
          imagem
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
