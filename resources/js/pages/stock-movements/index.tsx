import { Link, router } from '@inertiajs/react';
import { Plus, Trash2, Minus } from 'lucide-react';
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
    const { confirm } = useConfirm();

    const handleDelete = async (id: number) => {
        const result = await confirm({
            title: '¿Eliminar movimiento?',
            description: 'Esta acción no se puede deshacer. El movimiento será eliminado permanentemente.',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
        });

        if (result) {
            router.delete(`/stock-movements/${id}`, {
                onSuccess: () => {
                    toast.success('Movimiento eliminado correctamente');
                },
                onError: () => {
                    toast.error('Error al eliminar el movimiento');
                },
            });
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
        <div className="space-y-6 px-4">
            <div className="flex items-center justify-between mt-2">
                <Heading
                    title="Movimientos de Stock"
                    description={`Total de ${movements.total} movimiento(s)`}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-center">
                <Link href="/stock-movements/entry">
                    <Button className="w-1/2 bg-green-600 text-white hover:bg-green-700">
                        <Plus className=" h-4 w-4" />
                        Registrar Entrada
                    </Button>
                </Link>
                <Link href="/stock-movements/exit" className='items-end justify-end flex'>
                    <Button className="w-1/2 bg-red-600 text-white hover:bg-red-700">
                        <Minus className=" h-4 w-4" />
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
                                                variant="delete"
                                                size="icon"
                                                onClick={() => handleDelete(movement.id)}
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
