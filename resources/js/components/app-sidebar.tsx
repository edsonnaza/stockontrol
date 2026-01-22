import { NavFooter } from '@/components/nav-footer';
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Package, TrendingDown, AlertCircle } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Productos',
        href: '/products',
        icon: Package,
        items: [
            {
                title: 'Listar Productos',
                href: '/products',
            },
            {
                title: 'Crear Producto',
                href: '/products/create',
            },
        ],
    },
    {
        title: 'Movimientos de Stock',
        href: '/stock-movements',
        icon: TrendingDown,
        items: [
            {
                title: 'Registrar Entrada',
                href: '/stock-movements/entry',
            },
            {
                title: 'Registrar Salida',
                href: '/stock-movements/exit',
            },
            {
                title: 'Historial',
                href: '/stock-movements',
            },
        ],
    },
    {
        title: 'Stock',
        href: '/stock',
        icon: AlertCircle,
        items: [
            {
                title: 'Stock Actual',
                href: '/stock',
            },
            {
                title: 'Bajo Stock',
                href: '/stock/low-stock',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
