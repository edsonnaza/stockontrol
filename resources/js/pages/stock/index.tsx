import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { AlertCircle, Package, AlertTriangle, Boxes } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StockStats {
    total_products: number;
    low_stock: number;
    no_stock: number;
    total_items: number;
}

interface IndexProps {
    stats: StockStats;
}

export default function StockIndex({ stats }: IndexProps) {
    const StatCard = ({ 
        icon: Icon, 
        title, 
        value, 
        description, 
        color 
    }: { 
        icon: React.ComponentType<any>; 
        title: string; 
        value: number | string; 
        description: string;
        color: string;
    }) => (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Heading
                    title="Stock Actual"
                    description="Resumen general del inventario"
                />
                <Link href="/stock/low-stock">
                    <Button>
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Ver Bajo Stock
                    </Button>
                </Link>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={Package}
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

            {/* Alertas */}
            {stats.low_stock > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle className="text-orange-900">⚠️ Productos con Bajo Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-orange-800 mb-4">
                            Tienes <strong>{stats.low_stock}</strong> producto(s) con stock por debajo del mínimo establecido.
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
                        <p className="text-sm text-red-800 mb-4">
                            <strong>{stats.no_stock}</strong> producto(s) están completamente agotados.
                        </p>
                        <Link href="/stock/low-stock">
                            <Button size="sm">Registrar Entrada</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

StockIndex.layout = (page: React.ReactNode) => <AppLayout children={page} breadcrumbs={[
    { title: 'Stock', href: '/stock' }
]} />;
