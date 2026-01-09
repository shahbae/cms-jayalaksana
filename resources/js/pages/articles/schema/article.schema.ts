import { z } from 'zod';

export const articleSchema = z.object({
    title: z.string().min(3, 'Judul wajib diisi'),
    category_id: z.number({
        message: 'Kategori wajib dipilih',
    }),
    status: z.enum(['draft', 'published']),
    thumbnail: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 2 * 1024 * 1024,
            'Thumbnail maksimal 2MB',
        ),
    content: z.string().min(10, 'Konten minimal 10 karakter'),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
