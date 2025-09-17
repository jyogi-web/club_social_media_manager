import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'
import History from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { Button } from "@/components/ui/button"
import { Undo, Redo, Hash, AtSign } from "lucide-react"

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  maxBytes?: number
  initialContent?: string
}

export default function TiptapEditor({
  content,
  onChange,
  placeholder = "投稿したいテキストを入力してください...",
  maxBytes = 280,
  initialContent
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak,
      History,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxBytes,
      }),
    ],
    content: initialContent || content,
    onUpdate: ({ editor }) => {
      onChange(editor.getText())
    },
    editorProps: {
      attributes: {
        class: 'min-h-32 p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 max-w-none font-sans text-sm leading-relaxed',
      },
    },
  })

  // 半角全角を考慮したbyte数計算
  const calculateTextBytes = (text: string) => {
    let bytes = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i)
      if (char.match(/[\x00-\x7F]/)) {
        bytes += 1 // 半角文字
      } else {
        bytes += 2 // 全角文字
      }
    }
    return bytes
  }

  const currentBytes = calculateTextBytes(editor?.getText() || '')
  const isOverLimit = currentBytes > maxBytes

  if (!editor) {
    return null
  }

  const insertHashtag = () => {
    const selection = editor.state.selection
    const text = editor.state.doc.textBetween(selection.from, selection.to)
    if (text) {
      editor.chain().focus().insertContent(`#${text}`).run()
    } else {
      editor.chain().focus().insertContent('#').run()
    }
  }

  const insertMention = () => {
    const selection = editor.state.selection
    const text = editor.state.doc.textBetween(selection.from, selection.to)
    if (text) {
      editor.chain().focus().insertContent(`@${text}`).run()
    } else {
      editor.chain().focus().insertContent('@').run()
    }
  }

  return (
    <div className="border border-input rounded-md">
      {/* Twitter風ツールバー */}
      <div className="border-b border-input p-2 flex gap-1 flex-wrap items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={insertHashtag}
          title="ハッシュタグを挿入"
        >
          <Hash size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={insertMention}
          title="メンションを挿入"
        >
          <AtSign size={14} />
        </Button>
        <div className="border-l border-input mx-1 h-4" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="元に戻す"
        >
          <Undo size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="やり直し"
        >
          <Redo size={14} />
        </Button>
        <div className="flex-1" />
        <div className={`text-sm ${isOverLimit ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
          {isOverLimit ? `- ${currentBytes - maxBytes}byte` : `${currentBytes}/${maxBytes}byte`}
        </div>
      </div>

      {/* エディター */}
      <div className="min-h-32">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}