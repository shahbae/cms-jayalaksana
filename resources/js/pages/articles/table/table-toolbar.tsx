import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';

interface Props {
    search?: string | null;
    status?: string | null;
}

export function TableToolbar({ search, status }: Props) {
    const statusValue = status && status.length > 0 ? status : 'all';

    return (
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input
                defaultValue={search ?? ''}
                placeholder="Cari judul artikel..."
                className="max-w-xs"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        router.get(
                            '/articles',
                            {
                                search: (e.target as HTMLInputElement).value,
                                status,
                            },
                            { preserveState: true },
                        );
                    }
                }}
            />

            <Select
                value={statusValue}
                onValueChange={(value) =>
                    router.get(
                        '/articles',
                        { search, status: value === 'all' ? null : value },
                        { preserveState: true },
                    )
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Publik</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
