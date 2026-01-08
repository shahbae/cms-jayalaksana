import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserFormValues, userSchema } from '../schema/user.schema';

interface Props {
    mode: 'create' | 'edit';
    defaultValues?: Partial<UserFormValues>;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserModal({ mode, defaultValues, open, onOpenChange }: Props) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'Editor',
            is_active: true,
            ...defaultValues,
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = form;

    const isEdit = mode === 'edit';

    async function submit(values: UserFormValues) {
        const payload: Partial<UserFormValues> = { ...values };

        if (isEdit && payload.password === '') {
            delete payload.password;
        }

        if (isEdit && defaultValues?.id) {
            router.put(`/users/${defaultValues.id}`, payload, {
                preserveScroll: true,

                onSuccess: () => {
                    toast.success('Pengguna diperbarui dengan sukses');
                    form.reset();
                    onOpenChange(false);
                },
            });
        } else {
            router.post('/users', payload, {
                preserveScroll: true,

                onSuccess: () => {
                    toast.success('Pengguna dibuat dengan sukses');
                    form.reset();
                    onOpenChange(false);
                },
            });
        }
    }

    // saat modal ditutup → reset form
    useEffect(() => {
        if (!open) form.reset();
    }, [open, form]);

    // saat modal dibuka pada edit → set ulang form
    useEffect(() => {
        if (open && isEdit && defaultValues) {
            Object.entries(defaultValues).forEach(([key, value]) =>
                setValue(key as keyof UserFormValues, value as never),
            );
        }
    }, [defaultValues, isEdit, open, setValue]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? 'Edit Pengguna' : 'Buat Pengguna'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(submit)} className="space-y-4">
                    <div>
                        <Label>Nama</Label>
                        <Input {...register('name')} />
                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input type="email" {...register('email')} />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>
                            Kata Sandi{' '}
                            {isEdit && '(biarkan kosong jika tidak diubah)'}
                        </Label>
                        <Input type="password" {...register('password')} />
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Peran</Label>

                        <Select
                            value={form.watch('role')}
                            onValueChange={(v) =>
                                setValue('role', v as UserFormValues['role'])
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih peran" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Editor">Editor</SelectItem>
                            </SelectContent>
                        </Select>

                        {errors.role && (
                            <p className="text-sm text-red-500">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            checked={form.watch('is_active')}
                            onCheckedChange={(v) =>
                                setValue('is_active', Boolean(v))
                            }
                        />
                        <Label>Status Aktif</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>

                        <Button type="submit" disabled={isSubmitting}>
                            Simpan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
