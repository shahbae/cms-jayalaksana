import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MoreHorizontal, Pen, Trash } from 'lucide-react';

import { DeleteUserButton } from '../modal/delete';
import { UserModal } from '../modal/user-modal';
import { User } from '../types/user';

// =====================
// ACTION CELL
// =====================
const ActionCell = ({ row }: { row: { original: User } }) => {
    const user = row.original;

    const [editOpen, setEditOpen] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
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

            <UserModal
                mode="edit"
                open={editOpen}
                onOpenChange={setEditOpen}
                defaultValues={{
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.roles[0] === 'Admin' ? 'Admin' : 'Editor',
                    is_active: user.is_active,
                }}
            />

            {/* DELETE LOGIC INLINE */}
            {showDelete && (
                <DeleteUserButton
                    id={user.id}
                    open={showDelete}
                    onOpenChange={setShowDelete}
                />
            )}
        </>
    );
};

// =====================
// TABLE COLUMNS
// =====================
export const columns: ColumnDef<User>[] = [
    {
        id: 'rowNumber',
        header: 'No.',
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return pageIndex * pageSize + row.index + 1;
        },
    },

    { accessorKey: 'name', header: 'Nama' },

    { accessorKey: 'email', header: 'Email' },

    {
        accessorKey: 'roles',
        header: 'Peran',
        cell: ({ row }) => (
            <div>
                {row.original.roles.map((role) => (
                    <Badge key={role} variant="outline" className="mr-1">
                        {role}
                    </Badge>
                ))}
            </div>
        ),
    },

    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) =>
            row.original.is_active ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Active
                </Badge>
            ) : (
                <Badge className="bg-destructive/5 text-destructive">
                    Inactive
                </Badge>
            ),
    },

    {
        id: 'actions',
        cell: ({ row }) => <ActionCell row={row} />,
        enableSorting: false,
        enableHiding: false,
    },
];
