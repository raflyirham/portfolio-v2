"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  name: string;
  defaultHtml?: string | null;
}

export default function RichTextEditor({
  name,
  defaultHtml,
}: Readonly<RichTextEditorProps>) {
  const hiddenRef = useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
    ],
    content: defaultHtml ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap-editor min-h-[220px] rounded-lg border border-[#202024] bg-[#0b0b0d] px-4 py-3 text-sm text-white outline-none focus:border-blue-700 prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (hiddenRef.current) {
        hiddenRef.current.value = ed.getHTML();
      }
    },
  });

  useEffect(() => {
    if (!editor || !hiddenRef.current) {
      return;
    }

    hiddenRef.current.value = editor.getHTML();
  }, [editor]);

  return (
    <div className="grid gap-2">
      <textarea
        ref={hiddenRef}
        name={name}
        defaultValue={defaultHtml ?? ""}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
      />

      {editor ? (
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                editor.isActive("bold")
                  ? "border-blue-600 bg-blue-900/40 text-white"
                  : "border-[#202024] bg-[#131316] text-gray-300 hover:border-blue-700"
              }`}
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                editor.isActive("heading", { level: 1 })
                  ? "border-blue-600 bg-blue-900/40 text-white"
                  : "border-[#202024] bg-[#131316] text-gray-300 hover:border-blue-700"
              }`}
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                editor.isActive("heading", { level: 2 })
                  ? "border-blue-600 bg-blue-900/40 text-white"
                  : "border-[#202024] bg-[#131316] text-gray-300 hover:border-blue-700"
              }`}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                editor.isActive("heading", { level: 3 })
                  ? "border-blue-600 bg-blue-900/40 text-white"
                  : "border-[#202024] bg-[#131316] text-gray-300 hover:border-blue-700"
              }`}
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                editor.isActive("bulletList")
                  ? "border-blue-600 bg-blue-900/40 text-white"
                  : "border-[#202024] bg-[#131316] text-gray-300 hover:border-blue-700"
              }`}
            >
              Bullets
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                editor.isActive("orderedList")
                  ? "border-blue-600 bg-blue-900/40 text-white"
                  : "border-[#202024] bg-[#131316] text-gray-300 hover:border-blue-700"
              }`}
            >
              Numbered
            </button>
          </div>
          <EditorContent editor={editor} />
        </div>
      ) : null}
    </div>
  );
}
