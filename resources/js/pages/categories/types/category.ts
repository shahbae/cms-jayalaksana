export type Category = {
    id: number;
    name: string;
    slug: string;
    description: string;
};

export interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface Filters {
    per_page: number;
    search?: string | null;
}

export interface CategoriesPayload {
    data: Category[];
    meta: Meta;
    links: unknown[];
}

export interface Props {
    categories: CategoriesPayload;
    filters: Filters;
    success?: string;
}
