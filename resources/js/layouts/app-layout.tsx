import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    const page = usePage<SharedData>();
    const flash = page.props.flash;
    const lastShownRef = useRef<{
        success?: string | null;
        error?: string | null;
        warning?: string | null;
        info?: string | null;
    }>({});

    useEffect(() => {
        const next = {
            success: flash?.success ?? null,
            error: flash?.error ?? null,
            warning: flash?.warning ?? null,
            info: flash?.info ?? null,
        };

        if (next.success && lastShownRef.current.success !== next.success) {
            lastShownRef.current.success = next.success;
            toast.success(next.success);
        }

        if (next.error && lastShownRef.current.error !== next.error) {
            lastShownRef.current.error = next.error;
            toast.error(next.error);
        }

        if (next.warning && lastShownRef.current.warning !== next.warning) {
            lastShownRef.current.warning = next.warning;
            toast.warning(next.warning);
        }

        if (next.info && lastShownRef.current.info !== next.info) {
            lastShownRef.current.info = next.info;
            toast.message(next.info);
        }
    }, [flash?.error, flash?.info, flash?.success, flash?.warning]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <Toaster position="top-right" />
            {children}
        </AppLayoutTemplate>
    );
}
