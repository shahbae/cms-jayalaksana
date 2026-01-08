import { z } from 'zod';

export const categorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, 'Nama kategori harus diisi'),
    description: z.string().min(1, 'Deskripsi kategori harus diisi'),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
