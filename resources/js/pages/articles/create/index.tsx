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

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ArticleFormValues, articleSchema } from '../schema/article.schema';
import { Category } from '../types/type';

interface Props {
    categories: Category[];
}

export default function ArticleCreate({ categories }: Props) {
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null,
    );

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Artikel', href: '/articles' },
        { title: 'Buat Artikel', href: '/articles/create' },
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
        formState: { errors, isSubmitting },
        control,
    } = form;

    const content = useWatch({ control, name: 'content' }) ?? '';
    const status = useWatch({ control, name: 'status' });

    // Generate thumbnail preview
    useEffect(() => {
        if (!thumbnailFile) {
            setThumbnailPreview(null);
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setThumbnailPreview(
                typeof reader.result === 'string' ? reader.result : null,
            );
        };

        reader.onerror = () => {
            setThumbnailPreview(null);
            toast.error('Preview thumbnail gagal dibaca', {
                description:
                    'Gunakan JPG, PNG, atau WebP. Format kamera tertentu tidak didukung.',
            });
        };

        reader.readAsDataURL(thumbnailFile);

        return () => reader.abort();
    }, [thumbnailFile]);

    function submit(values: ArticleFormValues) {
        router.post('/articles', values, {
            forceFormData: true,
            preserveScroll: true,
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
                            Tulis dan kelola konten sebelum dipublikasikan.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(submit)}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* LEFT: CONTENT */}
                            <div className="space-y-6 lg:col-span-8">
                                {/* TITLE */}
                                <div className="flex flex-col gap-2">
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

                                {/* CONTENT */}
                                <div className="flex flex-col gap-2">
                                    <Label>Konten</Label>
                                    <SimpleEditor
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
                            </div>

                            {/* RIGHT: META */}
                            <div className="space-y-6 lg:col-span-4">
                                {/* STATUS */}
                                <div className="space-y-2 rounded-lg border p-4">
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

                                    <p className="text-xs text-muted-foreground">
                                        {status === 'published'
                                            ? 'Artikel akan langsung muncul di website publik.'
                                            : 'Artikel hanya tersimpan sebagai draft.'}
                                    </p>
                                </div>

                                {/* CATEGORY */}
                                <div className="space-y-2 rounded-lg border p-4">
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

                                {/* THUMBNAIL */}
                                <div className="space-y-3 rounded-lg border p-4">
                                    <Label>Thumbnail</Label>

                                    {thumbnailPreview ? (
                                        <img
                                            src={thumbnailPreview}
                                            className="h-40 w-full rounded-md object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                                            Belum ada gambar
                                        </div>
                                    )}

                                    <Input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] || null;
                                            setThumbnailFile(file);
                                            setValue(
                                                'thumbnail',
                                                file || undefined,
                                                { shouldValidate: true },
                                            );
                                        }}
                                    />

                                    {errors.thumbnail && (
                                        <p className="text-sm text-red-500">
                                            {errors.thumbnail.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
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
