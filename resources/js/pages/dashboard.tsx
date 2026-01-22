import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { AlertCircle, Box, AlertTriangle, Boxes } from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface StockStats {
    total_products: number;
    low_stock: number;
    no_stock: number;
    total_items: number;
}

interface CategoryStockData {
    name: string;
    value: number;
}

interface MovementData {
    date: string;
    Entradas: number;
    Salidas: number;
}

interface LowStockProductData {
    name: string;
    actual: number;
    minimo: number;
}

interface DashboardProps {
    stats: StockStats;
    stockByCategory: CategoryStockData[];
    recentMovements: MovementData[];
    lowStockProducts: LowStockProductData[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '#',
    },
];

interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

const StatCard = ({
    icon: Icon,
    title,
    value,
    description,
    color,
}: {
    icon: React.ComponentType<IconProps>;
    title: string;
    value: number | string;
    description: string;
    color: string;
}) => (
    <Card>
        <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className={`h-4 w-4 ${color}`} />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export default function Dashboard({
    stats,
    stockByCategory,
    recentMovements,
    lowStockProducts,
}: DashboardProps) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <Heading title="Dashboard" description="Resumen general del inventario" />

                {/* Estadísticas */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={Box}
                        title="Total Productos"
                        value={stats.total_products}
                        description="Productos activos en el sistema"
                        color="text-blue-600"
                    />
                    <StatCard
                        icon={Boxes}
                        title="Total Items"
                        value={stats.total_items}
                        description="Unidades totales en stock"
                        color="text-green-600"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        title="Stock Bajo"
                        value={stats.low_stock}
                        description="Productos bajo el mínimo"
                        color="text-yellow-600"
                    />
                    <StatCard
                        icon={AlertCircle}
                        title="Sin Stock"
                        value={stats.no_stock}
                        description="Productos agotados"
                        color="text-red-600"
                    />
                </div>

                {/* Acciones Rápidas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Link href="/stock-movements/entry">
                                <Button className="w-full" variant="outline">
                                    ➕ Registrar Entrada
                                </Button>
                            </Link>
                            <Link href="/stock-movements/exit">
                                <Button className="w-full" variant="outline">
                                    ➖ Registrar Salida
                                </Button>
                            </Link>
                            <Link href="/stock-movements">
                                <Button className="w-full" variant="outline">
                                    📋 Ver Historial
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Gráficos */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Stock por Categoría */}
                    {stockByCategory && stockByCategory.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Stock Total por Categoría</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={stockByCategory}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Últimos Movimientos */}
                    {recentMovements && recentMovements.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Últimos Movimientos (7 días)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={recentMovements}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="Entradas"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="Salidas"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Productos con Bajo Stock */}
                {lowStockProducts && lowStockProducts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Productos con Bajo Stock (Top 5)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={lowStockProducts}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 300 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={290} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="actual" fill="#ef4444" name="Stock Actual" />
                                    <Bar dataKey="minimo" fill="#f59e0b" name="Stock Mínimo" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Alertas */}
                {stats.low_stock > 0 && (
                    <Card className="border-orange-200 bg-orange-50">
                        <CardHeader>
                            <CardTitle className="text-orange-900">⚠️ Productos con Bajo Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-orange-800">
                                Tienes <strong>{stats.low_stock}</strong> producto(s) con stock por debajo del mínimo
                                establecido.
                            </p>
                            <Link href="/stock/low-stock">
                                <Button size="sm">Ver Detalles</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {stats.no_stock > 0 && (
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-red-900">🔴 Productos Sin Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-red-800">
                                <strong>{stats.no_stock}</strong> producto(s) están completamente agotados.
                            </p>
                            <Link href="/stock/low-stock">
                                <Button size="sm">Registrar Entrada</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
