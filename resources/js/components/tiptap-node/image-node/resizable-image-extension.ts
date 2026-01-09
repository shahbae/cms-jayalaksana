import { Image } from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ResizableImageNodeView } from '@/components/tiptap-node/image-node/resizable-image-node-view';

export const ResizableImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                parseHTML: (element) => {
                    const width = element.getAttribute('width');
                    if (width) {
                        const parsed = Number.parseFloat(width);
                        return Number.isFinite(parsed) ? parsed : null;
                    }

                    const styleWidth =
                        (element as HTMLElement).style?.width ?? '';
                    if (styleWidth.endsWith('px')) {
                        const parsed = Number.parseFloat(styleWidth);
                        return Number.isFinite(parsed) ? parsed : null;
                    }

                    return null;
                },
                renderHTML: (attributes) => {
                    if (!attributes.width) return {};
                    return { width: attributes.width };
                },
            },
            height: {
                default: null,
                parseHTML: (element) => {
                    const height = element.getAttribute('height');
                    if (height) {
                        const parsed = Number.parseFloat(height);
                        return Number.isFinite(parsed) ? parsed : null;
                    }

                    const styleHeight =
                        (element as HTMLElement).style?.height ?? '';
                    if (styleHeight.endsWith('px')) {
                        const parsed = Number.parseFloat(styleHeight);
                        return Number.isFinite(parsed) ? parsed : null;
                    }

                    return null;
                },
                renderHTML: (attributes) => {
                    if (!attributes.height) return {};
                    return { height: attributes.height };
                },
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageNodeView);
    },
});

