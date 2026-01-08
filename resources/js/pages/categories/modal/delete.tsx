import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { useState } from 'react';

export function DeleteCategoryButton({
    id,
    open,
    onOpenChange,
}: {
    id: number;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const isControlled = open !== undefined;
    const finalOpen = isControlled ? open : internalOpen;
    const finalSetOpen = isControlled ? onOpenChange : setInternalOpen;

    const submit = () => {
        setLoading(true);

        router.delete(`/categories/${id}`, {
            onFinish: () => setLoading(false),
            onSuccess: () => finalSetOpen?.(false),
        });
    };

    return (
        <Dialog open={finalOpen} onOpenChange={finalSetOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => finalSetOpen?.(true)}
                    >
                        <Trash className="text-red-500" />
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Hapus Kategori?</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Data yang sudah dihapus tidak dapat dikembalikan.
                </p>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => finalSetOpen?.(false)}
                        disabled={loading}
                    >
                        Batal
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={submit}
                        disabled={loading}
                    >
                        {loading ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
