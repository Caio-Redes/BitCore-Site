import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";

const lowlight = createLowlight(common);

const extensions = [
  StarterKit.configure({ codeBlock: false }),
  Link,
  Image,
  CodeBlockLowlight.configure({ lowlight }),
];

export function contentToHtml(content) {
  if (!content) return "";
  try {
    return generateHTML(content, extensions);
  } catch {
    return "";
  }
}
