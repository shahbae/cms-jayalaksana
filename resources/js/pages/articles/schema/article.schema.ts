import { z } from 'zod';

export const articleSchema = z.object({
    title: z.string().min(3, 'Judul wajib diisi'),
    category_id: z.number({
        message: 'Kategori wajib dipilih',
    }),
    status: z.enum(['draft', 'published']),
    content: z.string().min(10, 'Konten tidak boleh kosong'),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
