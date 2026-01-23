import { Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useConfirm } from '@/contexts/confirm-context';
import AppLayout from '@/layouts/app-layout';

interface Product {
    id: number;
    codigo: string;
    nombre: string;
    category?: {
        nombre: string;
    };
    stock_actual: number;
    stock_minimo: number;
    activo: boolean;
}

interface IndexProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function ProductsIndex({ products }: IndexProps) {
    const { confirm } = useConfirm();

    const handleDelete = async (id: number) => {
        const result = await confirm({
            title: '¿Eliminar producto?',
            description: 'Esta acción no se puede deshacer. El producto será eliminado permanentemente.',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
        });

        if (result) {
            router.delete(`/products/${id}`, {
                onSuccess: () => {
                    toast.success('Producto eliminado correctamente');
                },
                onError: () => {
                    toast.error('Error al eliminar el producto');
                },
            });
        }
    };

    const getStockStatus = (actual: number, minimo: number) => {
        if (actual === 0) {
            return { label: 'Sin Stock', className: 'bg-red-100 text-red-800' };
        }
        if (actual <= minimo) {
            return { label: 'Stock Bajo', className: 'bg-yellow-100 text-yellow-800' };
        }
        return { label: 'Normal', className: 'bg-green-100 text-green-800' };
    };

    return (
        <div className="space-y-1 px-4">
            <div className="flex items-center justify-between ml-2 pt-4">
                <Heading
                    title="List de Productos Disponibles"
                    description={`Total de ${products.total} producto(s)`}
                />
                <Link href="/products/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4 " />
                        Crear Producto
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {products.data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                No hay productos registrados
                            </p>
                            <Link href="/products/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Primer Producto
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Stock Actual</TableHead>
                                    <TableHead>Stock Mínimo</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Estatus</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.map((product) => {
                                    const status = getStockStatus(product.stock_actual, product.stock_minimo);
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-mono text-sm">
                                                {product.codigo}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {product.nombre}
                                            </TableCell>
                                            <TableCell>
                                                {product.category?.nombre || '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {product.stock_actual}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {product.stock_minimo}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={status.className}>
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={product.activo ? 'default' : 'secondary'}>
                                                    {product.activo ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/products/${product.id}/edit`}>
                                                        <Button variant="outline" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="delete"
                                                        size="icon"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
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

ProductsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} breadcrumbs={[
    { title: 'Productos', href: '/products' }
]} />;
