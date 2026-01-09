import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Editor } from '@tiptap/react';
import {
    Bold,
    Code,
    Heading2,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Undo,
} from 'lucide-react';

interface Props {
    editor: Editor;
}

export function TiptapToolbar({ editor }: Props) {
    const btn = (active: boolean) =>
        cn(
            'h-8 w-8',
            active ? 'bg-primary text-primary-foreground' : 'bg-transparent',
        );

    return (
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1">
            {/* TEXT */}
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className={btn(editor.isActive('bold'))}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold size={16} />
            </Button>

            <Button
                type="button"
                size="icon"
                variant="ghost"
                className={btn(editor.isActive('italic'))}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic size={16} />
            </Button>

            {/* HEADING */}
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className={btn(editor.isActive('heading', { level: 2 }))}
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                <Heading2 size={16} />
            </Button>

            {/* LIST */}
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className={btn(editor.isActive('bulletList'))}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List size={16} />
            </Button>

            <Button
                type="button"
                size="icon"
                variant="ghost"
                className={btn(editor.isActive('orderedList'))}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered size={16} />
            </Button>

            {/* BLOCK */}
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className={btn(editor.isActive('blockquote'))}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote size={16} />
            </Button>

            <Button
                type="button"
                size="icon"
                variant="ghost"
                className={btn(editor.isActive('codeBlock'))}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
                <Code size={16} />
            </Button>

            {/* UNDO / REDO */}
            <div className="ml-auto flex gap-1">
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo size={16} />
                </Button>

                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo size={16} />
                </Button>
            </div>
        </div>
    );
}
