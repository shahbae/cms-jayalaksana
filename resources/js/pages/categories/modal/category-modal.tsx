import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CategoryFormValues, categorySchema } from '../schema/category.schema';

interface Props {
    mode: 'create' | 'edit';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item?: CategoryFormValues;
}

export function CategoryModal({ mode, open, onOpenChange, item }: Props) {
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const { register, handleSubmit, reset, formState } = form;

    useEffect(() => {
        if (open && mode === 'edit' && item) {
            reset(item);
        }
        if (!open) reset();
    }, [open]);

    function submit(values: CategoryFormValues) {
        if (mode === 'edit' && item?.id) {
            router.put(`/categories/${item.id}`, values, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Kategori diperbarui');
                    onOpenChange(false);
                },
            });
        } else {
            router.post('/categories', values, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Kategori dibuat');
                    onOpenChange(false);
                },
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'edit' ? 'Edit Kategori' : 'Tambah Kategori'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    <div>
                        <Label>Nama</Label>
                        <Input {...register('name')} />
                        {formState.errors.name && (
                            <p className="text-sm text-red-500">
                                {formState.errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Deskripsi</Label>
                        <Textarea {...register('description')} />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={formState.isSubmitting}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
