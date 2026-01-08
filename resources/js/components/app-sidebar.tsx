import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

import {
    BookOpen,
    Folder,
    Image,
    LayoutGrid,
    ListChecks,
    Settings,
    Users,
} from 'lucide-react';

import { dashboard } from '@/routes';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage<SharedData>();

    const rawRoles = page.props.auth.user.roles;
    const roles: string[] = Array.isArray(rawRoles)
        ? rawRoles.filter((role): role is string => typeof role === 'string')
        : [];

    const isAdmin = roles.includes('Admin');
    const isEditor = roles.includes('Editor');

    const mainNavItems: NavItem[] = [
        {
            title: 'Dasbor',
            href: dashboard(),
            icon: LayoutGrid,
        },

        // =========================
        // DATA MASTER (ADMIN SAJA)
        // =========================
        ...(isAdmin
            ? [
                  {
                      title: 'Data Master',
                      icon: Folder,
                      items: [
                          {
                              title: 'Pengguna',
                              href: '/users',
                              icon: Users,
                          },
                          // {
                          //     title: 'Roles',
                          //     href: '/roles',
                          //     icon: Shield,
                          // },
                          {
                              title: 'Kategori',
                              href: '/categories',
                              icon: ListChecks,
                          },
                      ],
                  },
              ]
            : []),

        // =========================
        // KONTEN (ADMIN + EDITOR)
        // =========================
        ...(isAdmin || isEditor
            ? [
                  {
                      title: 'Konten',
                      icon: BookOpen,
                      items: [
                          {
                              title: 'Artikel',
                              href: '/articles',
                              icon: BookOpen,
                          },
                          {
                              title: 'Pustaka Media',
                              href: '/media',
                              icon: Image,
                          },
                      ],
                  },
              ]
            : []),

        // =========================
        // SISTEM (ADMIN SAJA)
        // =========================
        ...(isAdmin
            ? [
                  {
                      title: 'Sistem',
                      icon: Settings,
                      items: [
                          {
                              title: 'Log Aktivitas',
                              href: '/logs',
                              icon: ListChecks,
                          },
                          {
                              title: 'Pengaturan Situs',
                              href: '/settings',
                              icon: Settings,
                          },
                      ],
                  },
              ]
            : []),
    ];

    //   const footerNavItems: NavItem[] = [
    //     {
    //       title: 'Repository',
    //       href: 'https://github.com/laravel/react-starter-kit',
    //       icon: Folder,
    //     },
    //     {
    //       title: 'Documentation',
    //       href: 'https://laravel.com/docs/starter-kits#react',
    //       icon: BookOpen,
    //     },
    //   ]

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
