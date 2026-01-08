import { z } from 'zod';

export const userSchema = z
    .object({
        id: z.number().optional(),

        name: z.string().min(2, 'Nama wajib diisi'),
        email: z.string().email('Email tidak valid'),

        password: z
            .union([
                z.string().min(6, 'Password minimal 6 karakter'),
                z.literal(''),
            ])
            .optional(),

        role: z.enum(['Admin', 'Editor']).refine((val) => val !== undefined, {
            message: 'Role wajib dipilih',
        }),

        is_active: z.boolean(),
    })
    .superRefine((data, ctx) => {
        const isCreate = data.id === undefined;
        if (isCreate && (!data.password || data.password === '')) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Password wajib diisi',
                path: ['password'],
            });
        }
    });

export type UserFormValues = z.infer<typeof userSchema>;
