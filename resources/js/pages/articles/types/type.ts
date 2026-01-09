export interface Category {
    id: number;
    name: string;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    thumbnail?: string | null;
    status: 'draft' | 'published';
    published_at?: string | null;
    category: {
        id: number;
        name: string;
    };
    author: {
        id: number;
        name: string;
    };
}
