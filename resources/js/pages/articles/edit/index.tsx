import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

import ArticleForm from '../components/article-form';
import { Article, Category } from '../types/type';

interface Props {
    categories: Category[];
    article: Article;
}

export default function ArticleEdit({ categories, article }: Props) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Artikel', href: '/articles' },
        { title: 'Edit Artikel', href: `/articles/${article.id}/edit` },
    ];

    return (
        <>
            <Head title="Edit Artikel" />

            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="space-y-6 px-4 py-6 sm:p-6">
                    {/* HEADER */}
                    <div>
                        <h1 className="text-2xl font-bold">Edit Artikel</h1>
                        <p className="text-sm text-muted-foreground">
                            Ubah dan perbarui konten artikel.
                        </p>
                    </div>

                    {/* FORM */}
                    <ArticleForm
                        mode="edit"
                        article={article}
                        categories={categories}
                    />
                </div>
            </AppLayout>
        </>
    );
}
