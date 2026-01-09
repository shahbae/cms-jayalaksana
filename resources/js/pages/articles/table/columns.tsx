import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pen, Trash } from 'lucide-react';
import { Article } from '../types/type';

export const columns: ColumnDef<Article>[] = [
    {
        id: 'rowNumber',
        header: 'No',
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return pageIndex * pageSize + row.index + 1;
        },
    },
    {
        accessorKey: 'title',
        header: 'Judul',
        cell: ({ row }) => (
            <div className="max-w-[320px] truncate font-medium">
                {row.original.title}
            </div>
        ),
    },
    {
        accessorKey: 'category.name',
        header: 'Kategori',
    },
    {
        accessorKey: 'author.name',
        header: 'Penulis',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) =>
            row.original.status === 'published' ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Publik
                </Badge>
            ) : (
                <Badge variant="secondary">Draft</Badge>
            ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const article = row.original;

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() =>
                                    router.visit(`/articles/${article.id}/edit`)
                                }
                            >
                                <Pen className="mr-1 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                    const ok = confirm(
                                        `Hapus artikel "${article.title}"?`,
                                    );
                                    if (!ok) return;

                                    router.delete(`/articles/${article.id}`, {
                                        preserveScroll: true,
                                    });
                                }}
                            >
                                <Trash className="mr-1 h-4 w-4 text-red-600" />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];
