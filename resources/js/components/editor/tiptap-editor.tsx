import { cn } from '@/lib/utils';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { TiptapToolbar } from './tiptap-toolbar';

interface Props {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function TiptapEditor({ value = '', onChange, className }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm min-h-[260px] max-w-none focus:outline-none',
                    className,
                ),
            },
        },
        onUpdate({ editor }) {
            onChange?.(editor.getHTML());
        },
    });

    // Sync external value (important for edit page)
    useEffect(() => {
        if (!editor) return;
        if (editor.getHTML() !== value) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className="rounded-md border">
            {/* TOOLBAR */}
            <TiptapToolbar editor={editor} />

            {/* EDITOR */}
            <div className="p-3">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
