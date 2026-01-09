import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { TableToolbar } from './table/table-toolbar';
import { Article } from './types/type';

interface Props {
    articles: {
        data: Article[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    filters: {
        search?: string | null;
        status?: string | null;
    };
    success?: string;
}

export default function ArticlesIndex({ articles, filters, success }: Props) {
    if (success) toast.success(success);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Articles', href: '/articles' },
    ];

    return (
        <>
            <Head title="Articles" />

            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-4 px-4 py-4 sm:p-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Manajemen Artikel
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Kelola konten artikel, draft, dan publikasi.
                            </p>
                        </div>

                        <Button asChild>
                            <Link href="/articles/create">Tambah Artikel</Link>
                        </Button>
                    </div>

                    <TableToolbar
                        search={filters.search}
                        status={filters.status}
                    />

                    <DataTable
                        data={articles.data}
                        columns={columns}
                        meta={articles.meta}
                    />
                </div>
            </AppLayout>
        </>
    );
}
