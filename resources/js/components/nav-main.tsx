import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useActiveUrl } from '@/hooks/use-active-url';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { urlIsActive } = useActiveUrl();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarMenu className="gap-2">
                {items.map((item) => {
                    // ======================
                    //  PARENT WITH CHILDREN
                    // ======================
                    if (item.items) {
                        const parentIsActive = item.items.some((child) =>
                            urlIsActive(child.href!),
                        );

                        return (
                            <div key={item.title}>
                                <SidebarGroupLabel
                                    className={
                                        parentIsActive
                                            ? 'h-9 font-semibold text-primary'
                                            : 'h-9 opacity-70'
                                    }
                                >
                                    {item.title}
                                </SidebarGroupLabel>

                                <SidebarMenu className="gap-0">
                                    {item.items.map((child) => (
                                        <SidebarMenuItem key={child.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={urlIsActive(
                                                    child.href!,
                                                )}
                                                tooltip={{
                                                    children: child.title,
                                                }}
                                                className="h-10 px-3"
                                            >
                                                <Link
                                                    href={child.href!}
                                                    prefetch
                                                >
                                                    {child.icon && (
                                                        <child.icon />
                                                    )}
                                                    <span>{child.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </div>
                        );
                    }

                    // ======================
                    //  SINGLE LINK ITEM
                    // ======================
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={urlIsActive(item.href!)}
                                tooltip={{ children: item.title }}
                                className="h-10 px-3"
                            >
                                <Link href={item.href!} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
