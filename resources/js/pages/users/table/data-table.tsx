import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { Command, CommandGroup, CommandItem } from '@/components/ui/command';

import { Button } from '@/components/ui/button';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table';

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

import { router } from '@inertiajs/react';
import { useState } from 'react';

interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    meta: Meta;
}

export function DataTable<TData, TValue>({
    data,
    columns,
    meta,
}: Props<TData, TValue>) {
    const [pageIndex, setPageIndex] = useState(meta.current_page - 1);
    const [pageSize, setPageSize] = useState(meta.per_page);

    const table = useReactTable({
        data,
        columns,
        pageCount: meta.last_page,
        state: { pagination: { pageIndex, pageSize } },
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),

        onPaginationChange: (updater) => {
            const next =
                typeof updater === 'function'
                    ? updater({ pageIndex, pageSize })
                    : updater;

            setPageIndex(next.pageIndex);
            setPageSize(next.pageSize);

            router.get(
                '/users',
                { page: next.pageIndex + 1, per_page: next.pageSize },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        },
    });

    return (
        <div className="overflow-hidden rounded-lg border">
            {/* TABLE */}
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                        <TableRow className="bg-muted/50" key={hg.id}>
                            {hg.headers.map((h) => (
                                <TableHead
                                    key={h.id}
                                    className="border-x border-gray-100"
                                >
                                    {flexRender(
                                        h.column.columnDef.header,
                                        h.getContext(),
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className="border-x border-gray-100 py-1"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="py-6 text-center"
                            >
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* FOOTER */}
            <div className="flex flex-col items-center justify-between gap-1 border-t bg-muted/30 px-3 py-3 sm:flex-row sm:gap-0">
                {/* LEFT */}
                <div className="flex items-center gap-2 text-sm">
                    Menampilkan
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-fit justify-between !text-sm"
                                size="sm"
                            >
                                {pageSize}
                                <ChevronDown size={16} />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-32 p-0">
                            <Command>
                                <CommandGroup>
                                    {[10, 25, 50].map((size) => (
                                        <CommandItem
                                            key={size}
                                            value={String(size)}
                                            onSelect={() =>
                                                table.setPageSize(size)
                                            }
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    pageSize === size
                                                        ? 'opacity-100'
                                                        : 'opacity-0',
                                                )}
                                            />
                                            {size}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    dari {meta.total} data
                </div>

                <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
                    {/* CENTER */}
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
                        {/* Page X of Y */}
                        <div className="text-sm">
                            Halaman {pageIndex + 1} dari {meta.last_page}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft size={16} />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft size={16} />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight size={16} />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                table.setPageIndex(meta.last_page - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
