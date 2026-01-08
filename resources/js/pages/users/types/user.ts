export type User = {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: ('Admin' | 'Editor')[];
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

export interface UsersPayload {
    data: User[];
    meta: Meta;
    links: unknown[];
}

export interface Props {
    users: UsersPayload;
    filters: Filters;
    success?: string;
}
