import { TiptapEditor } from '@/components/editor/tiptap-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArticleFormValues, articleSchema } from '../schema/article.schema';
import { Category } from '../types/type';

interface Props {
    categories: Category[];
}

export default function ArticleCreate({ categories }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Articles', href: '/articles' },
        { title: 'Create', href: '/articles/create' },
    ];

    const form = useForm<ArticleFormValues>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: '',
            category_id: undefined,
            status: 'draft',
            content: '',
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = form;

    const content = watch('content');

    function submit(values: ArticleFormValues) {
        router.post('/articles', values, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Artikel berhasil dibuat');
                router.visit('/articles');
            },
        });
    }

    return (
        <>
            <Head title="Create Article" />

            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 px-4 py-6 sm:p-6">
                    {/* HEADER */}
                    <div>
                        <h1 className="text-2xl font-bold">Buat Artikel</h1>
                        <p className="text-sm text-muted-foreground">
                            Tulis dan kelola konten artikel sebelum
                            dipublikasikan.
                        </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit(submit)} className="space-y-6">
                        {/* TITLE */}
                        <div className="space-y-1">
                            <Label>Judul</Label>
                            <Input
                                placeholder="Judul artikel"
                                {...register('title')}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* META GRID */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* CATEGORY */}
                            <div className="space-y-1">
                                <Label>Kategori</Label>
                                <Select
                                    onValueChange={(v) =>
                                        setValue('category_id', Number(v), {
                                            shouldValidate: true,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={String(cat.id)}
                                            >
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.category_id.message}
                                    </p>
                                )}
                            </div>

                            {/* STATUS */}
                            <div className="space-y-1">
                                <Label>Status</Label>
                                <Select
                                    defaultValue="draft"
                                    onValueChange={(v) =>
                                        setValue(
                                            'status',
                                            v as 'draft' | 'published',
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            Draft
                                        </SelectItem>
                                        <SelectItem value="published">
                                            Published
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="space-y-1">
                            <Label>Konten</Label>
                            <TiptapEditor
                                value={content}
                                onChange={(html) =>
                                    setValue('content', html, {
                                        shouldValidate: true,
                                    })
                                }
                            />
                            {errors.content && (
                                <p className="text-sm text-red-500">
                                    {errors.content.message}
                                </p>
                            )}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-2 border-t pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => router.visit('/articles')}
                            >
                                Batal
                            </Button>

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </AppLayout>
        </>
    );
}
