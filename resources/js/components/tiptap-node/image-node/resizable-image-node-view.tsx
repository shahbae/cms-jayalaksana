'use client';

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from 'react';

const MIN_SIZE_PX = 80;

function toNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

export const ResizableImageNodeView: React.FC<NodeViewProps> = (props) => {
    const { node, selected, updateAttributes } = props;
    const imgRef = useRef<HTMLImageElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const resizeStateRef = useRef<{
        startX: number;
        startY: number;
        startWidth: number;
        startHeight: number;
        ratio: number;
    } | null>(null);

    const widthAttr = toNumber(node.attrs.width);
    const heightAttr = toNumber(node.attrs.height);

    const imgStyle = useMemo<CSSProperties>(() => {
        return {
            width: widthAttr ? `${Math.round(widthAttr)}px` : undefined,
            height: heightAttr ? `${Math.round(heightAttr)}px` : undefined,
        };
    }, [heightAttr, widthAttr]);

    useEffect(() => {
        if (!isResizing) return;

        const handlePointerMove = (event: PointerEvent) => {
            const state = resizeStateRef.current;
            if (!state) return;

            const deltaX = event.clientX - state.startX;
            const deltaY = event.clientY - state.startY;

            const nextWidth = Math.max(MIN_SIZE_PX, state.startWidth + deltaX);
            const nextHeight = Math.max(
                MIN_SIZE_PX,
                state.startHeight + deltaY,
            );

            const widthBasedHeight = nextWidth / state.ratio;
            const heightBasedWidth = nextHeight * state.ratio;

            const useWidth = Math.abs(deltaX) >= Math.abs(deltaY);
            const resolvedWidth = useWidth ? nextWidth : heightBasedWidth;
            const resolvedHeight = useWidth ? widthBasedHeight : nextHeight;

            updateAttributes({
                width: Math.round(resolvedWidth),
                height: Math.round(resolvedHeight),
            });
        };

        const handlePointerUp = () => {
            resizeStateRef.current = null;
            setIsResizing(false);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp, { once: true });

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isResizing, updateAttributes]);

    const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (
        event,
    ) => {
        event.preventDefault();
        event.stopPropagation();

        const imgEl = imgRef.current;
        if (!imgEl) return;

        const rect = imgEl.getBoundingClientRect();
        const ratio =
            rect.height > 0
                ? rect.width / rect.height
                : imgEl.naturalHeight > 0
                  ? imgEl.naturalWidth / imgEl.naturalHeight
                  : 1;

        resizeStateRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            startWidth: rect.width,
            startHeight: rect.height,
            ratio: ratio > 0 ? ratio : 1,
        };
        setIsResizing(true);
    };

    return (
        <NodeViewWrapper
            ref={wrapperRef}
            className="tiptap-image-resizable"
            data-resizing={isResizing ? 'true' : 'false'}
            data-selected={selected ? 'true' : 'false'}
        >
            <img
                ref={imgRef}
                className="tiptap-image-resizable__img"
                src={node.attrs.src}
                alt={node.attrs.alt}
                title={node.attrs.title}
                style={imgStyle}
                draggable={false}
            />

            <div
                className="tiptap-image-resizable__handle tiptap-image-resizable__handle--se"
                contentEditable={false}
                onPointerDown={handlePointerDown}
            />
        </NodeViewWrapper>
    );
};
