import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { AlertCircle, TrendingUp, Package, ArrowDownRight, ArrowUpRight, Activity } from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface KPIs {
    total_movimientos: number;
    total_entradas: number;
    total_salidas: number;
    rotacion_promedio: number;
}

interface CategoryDistribution {
    name: string;
    value: number;
}

interface RecentMovement {
    id: number;
    producto: string;
    tipo: string;
    cantidad: number;
    usuario: string;
    fecha: string;
    motivo: string;
}

interface MovementTrend {
    date: string;
    Entradas: number;
    Salidas: number;
}

interface TopProduct {
    name: string;
    movimientos: number;
    cantidad: number;
}

interface DashboardProps {
    kpis: KPIs;
    categoryDistribution: CategoryDistribution[];
    recentMovements: RecentMovement[];
    movementsTrend: MovementTrend[];
    topMovedProducts: TopProduct[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '#',
    },
];

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];

const KPICard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
    trend,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string | number;
    subtitle: string;
    color: string;
    trend?: number;
}) => (
    <div className={`rounded-lg border-2 ${color} bg-linear-to-br from-white to-gray-50 p-6`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            </div>
            <div className={`rounded-lg ${color.replace('border', 'bg')} p-3 opacity-20`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
        {trend !== undefined && (
            <div className="mt-4 flex items-center gap-1">
                {trend > 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(trend)}% vs mes anterior
                </span>
            </div>
        )}
    </div>
);

const ShortcutButton = ({
    icon: Icon,
    label,
    href,
    color,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    color: string;
}) => (
    <Link href={href}>
        <div className={`flex flex-col items-center gap-2 rounded-lg border-2 ${color} bg-white p-6 text-center transition-all hover:shadow-lg`}>
            <div className={`rounded-lg ${color.replace('border', 'bg')} p-3 opacity-20`}>
                <Icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-900">{label}</span>
        </div>
    </Link>
);

export default function Dashboard({
    kpis,
    categoryDistribution,
    recentMovements,
    movementsTrend,
    topMovedProducts,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                {/* Hero Section */}
                <div className="rounded-lg border-2 border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 p-8">
                    <Heading
                        title="Informe de Inventario"
                        description="Análisis detallado de movimientos y rotación de stock (últimos 30 días)"
                    />
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <KPICard
                        icon={Activity}
                        title="Movimientos"
                        value={kpis.total_movimientos}
                        subtitle="últimos 30 días"
                        color="border-blue-200"
                    />
                    <KPICard
                        icon={ArrowUpRight}
                        title="Total Entradas"
                        value={kpis.total_entradas}
                        subtitle="unidades ingresadas"
                        color="border-green-200"
                    />
                    <KPICard
                        icon={ArrowDownRight}
                        title="Total Salidas"
                        value={kpis.total_salidas}
                        subtitle="unidades sacadas"
                        color="border-red-200"
                    />
                    <KPICard
                        icon={TrendingUp}
                        title="Rotación Promedio"
                        value={kpis.rotacion_promedio}
                        subtitle="movimientos/producto"
                        color="border-purple-200"
                    />
                </div>

                {/* Shortcuts */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <ShortcutButton
                        icon={Package}
                        label="Registrar Entrada"
                        href="/stock-movements/entry"
                        color="border-green-200"
                    />
                    <ShortcutButton
                        icon={Package}
                        label="Registrar Salida"
                        href="/stock-movements/exit"
                        color="border-red-200"
                    />
                    <ShortcutButton
                        icon={AlertCircle}
                        label="Ver Bajo Stock"
                        href="/stock/low-stock"
                        color="border-yellow-200"
                    />
                    <ShortcutButton
                        icon={Activity}
                        label="Historial Movimientos"
                        href="/stock-movements"
                        color="border-purple-200"
                    />
                </div>

                {/* Gráficos principales */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Área: Tendencia de Movimientos */}
                    {movementsTrend && movementsTrend.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Tendencia de Movimientos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={movementsTrend}>
                                        <defs>
                                            <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorSalidas" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="date" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="Entradas"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#colorEntradas)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="Salidas"
                                            stroke="#ef4444"
                                            fillOpacity={1}
                                            fill="url(#colorSalidas)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pie: Distribución de Categorías */}
                    {categoryDistribution && categoryDistribution.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Distribución de Productos por Categoría</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={categoryDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name} (${value})`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {categoryDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Productos más movidos */}
                {topMovedProducts && topMovedProducts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Top 5 Productos con Mayor Rotación</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={topMovedProducts}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                                    <Legend />
                                    <Bar dataKey="movimientos" fill="#3b82f6" name="Movimientos" />
                                    <Bar dataKey="cantidad" fill="#f59e0b" name="Cantidad Total" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Últimos Movimientos */}
                {recentMovements && recentMovements.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Últimos Movimientos Registrados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Producto</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead className="text-right">Cantidad</TableHead>
                                            <TableHead>Motivo</TableHead>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Fecha</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentMovements.map((movement) => (
                                            <TableRow key={movement.id}>
                                                <TableCell className="font-medium">{movement.producto}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={movement.tipo === 'entrada' ? 'default' : 'destructive'}
                                                    >
                                                        {movement.tipo === 'entrada' ? '↑ Entrada' : '↓ Salida'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {movement.cantidad}
                                                </TableCell>
                                                <TableCell>{movement.motivo}</TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    {movement.usuario}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">{movement.fecha}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
