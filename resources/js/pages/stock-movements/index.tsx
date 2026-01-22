import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
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

interface Movement {
    id: number;
    product: {
        codigo: string;
        nombre: string;
    };
    tipo: 'entrada' | 'salida';
    cantidad: number;
    motivo: string;
    notas: string | null;
    user: {
        name: string;
    };
    created_at: string;
}

interface IndexProps {
    movements: {
        data: Movement[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function StockMovementsIndex({ movements }: IndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
            router.delete(`/stock-movements/${id}`);
        }
    };

    const getTipoLabel = (tipo: string) => {
        return tipo === 'entrada' ? 'Entrada' : 'Salida';
    };

    const getTipoColor = (tipo: string) => {
        return tipo === 'entrada' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800';
    };

    const getMotivoLabel = (motivo: string) => {
        const motivos: Record<string, string> = {
            'compra': 'Compra',
            'venta': 'Venta',
            'ajuste': 'Ajuste',
            'devolución': 'Devolución',
            'otro': 'Otro'
        };
        return motivos[motivo] || motivo;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Heading
                    title="Movimientos de Stock"
                    description={`Total de ${movements.total} movimiento(s)`}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Link href="/stock-movements/entry">
                    <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Registrar Entrada
                    </Button>
                </Link>
                <Link href="/stock-movements/exit">
                    <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Registrar Salida
                    </Button>
                </Link>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {movements.data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                No hay movimientos de stock registrados
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Producto</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Cantidad</TableHead>
                                    <TableHead>Motivo</TableHead>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movements.data.map((movement) => (
                                    <TableRow key={movement.id}>
                                        <TableCell className="font-medium">
                                            <div>
                                                <p className="font-semibold">{movement.product.nombre}</p>
                                                <p className="text-sm text-muted-foreground">{movement.product.codigo}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getTipoColor(movement.tipo)}>
                                                {getTipoLabel(movement.tipo)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold">{movement.cantidad}</span>
                                        </TableCell>
                                        <TableCell>
                                            {getMotivoLabel(movement.motivo)}
                                        </TableCell>
                                        <TableCell>
                                            {movement.user.name}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(movement.created_at).toLocaleDateString('es-ES')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(movement.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

StockMovementsIndex.layout = (page: React.ReactNode) => <AppLayout children={page} breadcrumbs={[
    { title: 'Movimientos de Stock', href: '/stock-movements' }
]} />;
