import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pen, Trash } from 'lucide-react';
import { useState } from 'react';
import { CategoryModal } from '../modal/category-modal';
import { DeleteCategoryButton } from '../modal/delete';
import { Category } from '../types/category';
// import { CategoryModal } from './modal/form';

const ActionCell = ({ row }: { row: { original: Category } }) => {
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const item = row.original;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEdit(true)}>
                        <Pen className="mr-1 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setShowDelete(true)}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash className="mr-1 h-4 w-4 text-red-600" />
                        Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CategoryModal
                mode="edit"
                open={showEdit}
                onOpenChange={setShowEdit}
                item={item}
            />

            {showDelete && (
                <DeleteCategoryButton
                    id={item.id}
                    open={showDelete}
                    onOpenChange={setShowDelete}
                />
            )}
        </>
    );
};

export const columns: ColumnDef<Category>[] = [
    {
        id: 'no',
        header: 'No',
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return pageIndex * pageSize + row.index + 1;
        },
    },
    { accessorKey: 'name', header: 'Nama' },
    { accessorKey: 'description', header: 'Deskripsi' },
    {
        id: 'actions',
        cell: ({ row }) => <ActionCell row={row} />,
        enableSorting: false,
    },
];
