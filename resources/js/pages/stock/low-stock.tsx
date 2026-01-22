import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
    id: number;
    codigo: string;
    nombre: string;
    stock_actual: number;
    stock_minimo: number;
    activo: boolean;
    category?: {
        nombre: string;
    };
}

interface LowStockProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function StockLowStock({ products }: LowStockProps) {
    const getAlertLevel = (actual: number, minimo: number) => {
        if (actual === 0) {
            return { label: 'Sin Stock', color: 'bg-red-100 text-red-800', icon: '🔴' };
        }
        if (actual < minimo / 2) {
            return { label: 'Crítico', color: 'bg-orange-100 text-orange-800', icon: '⚠️' };
        }
        return { label: 'Bajo', color: 'bg-yellow-100 text-yellow-800', icon: '⚡' };
    };

    const deficit = (actual: number, minimo: number) => {
        return minimo - actual;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/stock">
                    <Button variant="outline" size="icon">
                        <AlertTriangle className="h-4 w-4" />
                    </Button>
                </Link>
                <Heading
                    title="Productos con Bajo Stock"
                    description={`${products.total} producto(s) necesita(n) reabastecimiento`}
                />
            </div>

            {products.total > 0 && (
                <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
                    <p className="text-sm text-orange-800">
                        <strong>⚠️ Atención:</strong> Tienes {products.total} producto(s) con stock por debajo del mínimo establecido. 
                        Considera registrar entradas para mantener el inventario óptimo.
                    </p>
                </div>
            )}

            <Card>
                <CardContent className="pt-6">
                    {products.data.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">✅</div>
                            <p className="text-muted-foreground mb-4 font-semibold text-lg">
                                ¡Excelente! Todos los productos tienen stock suficiente
                            </p>
                            <Link href="/stock-movements/entry">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Registrar Entrada
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Stock Actual</TableHead>
                                    <TableHead>Stock Mínimo</TableHead>
                                    <TableHead>Déficit</TableHead>
                                    <TableHead>Alerta</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.map((product) => {
                                    const alert = getAlertLevel(product.stock_actual, product.stock_minimo);
                                    const def = deficit(product.stock_actual, product.stock_minimo);
                                    return (
                                        <TableRow key={product.id} className="hover:bg-orange-50/50">
                                            <TableCell className="font-medium">
                                                <div>
                                                    <p className="font-semibold">{product.nombre}</p>
                                                    <p className="text-sm text-muted-foreground">{product.codigo}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {product.category?.nombre || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-lg">{product.stock_actual}</span>
                                            </TableCell>
                                            <TableCell>
                                                {product.stock_minimo}
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-red-600">+{def}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={alert.color}>
                                                    {alert.icon} {alert.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/products/${product.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        Ver Producto
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

StockLowStock.layout = (page: React.ReactNode) => <AppLayout children={page} breadcrumbs={[
    { title: 'Stock', href: '/stock' },
    { title: 'Bajo Stock', href: '#' }
]} />;
