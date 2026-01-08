import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CategoryModal } from './modal/category-modal';
import { columns } from './table/columns';
import { DataTable } from './table/data-table';
import { TableSearch } from './table/table-toolbar';
import { Category } from './types/category';

interface Props {
    categories: {
        data: Category[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
        links: unknown[];
    };
    filters: {
        per_page: number;
        search?: string | null;
    };
    success?: string;
}

export default function CategoriesIndex({
    categories,
    filters,
    success,
}: Props) {
    if (success) toast.success(success);

    const [createOpen, setCreateOpen] = useState(false);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kategori', href: '/categories' },
    ];

    return (
        <>
            <Head title="Kategori" />

            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-3 px-4 py-4 sm:p-6">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold sm:text-2xl">
                            Manajemen Kategori
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Lihat, buat, edit, hapus, dan tampilkan data
                            Kategori.
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <TableSearch
                            defaultValue={filters.search ?? undefined}
                        />
                        <Button onClick={() => setCreateOpen(true)}>
                            <Plus />
                            Tambah
                        </Button>
                    </div>
                    <DataTable
                        columns={columns}
                        data={categories.data}
                        meta={categories.meta}
                    />
                </div>
            </AppLayout>

            <CategoryModal
                mode="create"
                open={createOpen}
                onOpenChange={setCreateOpen}
            />
        </>
    );
}
