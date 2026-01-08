import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TableSearch({ defaultValue }: { defaultValue?: string }) {
    const [search, setSearch] = useState(defaultValue || '');

    useEffect(() => {
        if (search !== defaultValue) {
            const timeout = setTimeout(() => {
                router.get(
                    '/users',
                    { search },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    },
                );
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [search]);

    return (
        <div className="flex items-center py-2">
            <Input
                startIcon={<Search className="h-4 w-4" />}
                placeholder="Cari data pengguna"
                value={search}
                className="w-[260px]"
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
}
