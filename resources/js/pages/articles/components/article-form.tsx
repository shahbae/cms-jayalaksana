import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ArticleFormValues, articleSchema } from '../schema/article.schema';
import { Article, Category } from '../types/type';

interface Props {
    categories: Category[];
    article?: Article;
    mode: 'create' | 'edit';
}

export default function ArticleForm({ categories, article, mode }: Props) {
    console.log(article);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        article?.thumbnail ? `/storage/${article.thumbnail}` : null,
    );

    const form = useForm<ArticleFormValues>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: article?.title ?? '',
            category_id: article?.category?.id ?? undefined,
            status: article?.status ?? 'draft',
            content: (article as any)?.content ?? '',
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

    // thumbnail preview
    useEffect(() => {
        if (!thumbnailFile) return;

        const reader = new FileReader();
        reader.onload = () => {
            setThumbnailPreview(
                typeof reader.result === 'string' ? reader.result : null,
            );
        };
        reader.readAsDataURL(thumbnailFile);
        return () => reader.abort();
    }, [thumbnailFile]);

    function submit(values: ArticleFormValues) {
        if (mode === 'create') {
            router.post('/articles', values, {
                forceFormData: true,
            });
        } else {
            router.post(
                `/articles/${article!.id}`,
                { ...values, _method: 'put' },
                { forceFormData: true },
            );
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* LEFT */}
                <div className="space-y-6 lg:col-span-8">
                    <div className="space-y-2">
                        <Label>Judul</Label>
                        <Input
                            {...register('title')}
                            placeholder="Masukkan judul artikel"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
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

                {/* RIGHT */}
                <div className="space-y-6 lg:col-span-4">
                    {/* STATUS */}
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                        <Label>Status</Label>
                        <Select
                            value={status}
                            onValueChange={(v) =>
                                setValue('status', v as 'draft' | 'published', {
                                    shouldValidate: true,
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">
                                    <label className="text-sm font-black text-gray-500 uppercase">
                                        Draft
                                    </label>
                                </SelectItem>
                                <SelectItem value="published">
                                    <label className="text-sm font-black text-green-500 uppercase">
                                        Publik
                                    </label>
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
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
                        <Label>Kategori</Label>
                        <Select
                            defaultValue={
                                article?.category
                                    ? String(article.category.id)
                                    : undefined
                            }
                            onValueChange={(v) =>
                                setValue('category_id', Number(v))
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
                    </div>

                    {/* THUMBNAIL */}
                    <div className="flex flex-col gap-2 rounded-lg border p-4">
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
                                const file = e.target.files?.[0] || null;
                                setThumbnailFile(file);
                                setValue('thumbnail', file || undefined, {
                                    shouldValidate: true,
                                });
                            }}
                        />
                    </div>

                    {/* SAVE */}
                    <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                        <Button variant="outline" asChild>
                            <Link href="/articles" prefetch>
                                Batal
                            </Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Menyimpan...'
                                : mode === 'create'
                                  ? 'Simpan'
                                  : 'Update'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
