import { Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Loader } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxItemsFiltered,
} from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

interface Product {
    id: number;
    codigo: string;
    nombre: string;
    stock_actual: number;
    stock_minimo: number;
    category?: {
        nombre: string;
    };
}

interface EntryProps {
    products: Product[];
}

const MOTIVOS = [
    { value: 'compra', label: 'Compra' },
    { value: 'devolución', label: 'Devolución de cliente' },
    { value: 'ajuste', label: 'Ajuste de inventario' },
    { value: 'otro', label: 'Otro' },
];

export default function StockMovementsEntry({ products }: EntryProps) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: 0,
        tipo: 'entrada',
        cantidad: 1,
        motivo: '',
        notas: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/stock-movements');
    };

    const selectedProduct = products.find(p => p.id === (typeof data.product_id === 'number' ? data.product_id : parseInt(data.product_id as string)));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/stock-movements">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <Heading
                    title="Registrar Entrada de Stock"
                    description="Registra la entrada de productos al inventario"
                />
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Producto */}
                            <div className="space-y-2">
                                <Label htmlFor="product_id">Producto *</Label>
                                <Combobox
                                    options={products.map((p) => ({
                                        value: p.id,
                                        label: `${p.codigo} - ${p.nombre}`,
                                    }))}
                                    value={data.product_id || 0}
                                    onValueChange={(value) => setData('product_id', value)}
                                    placeholder="Selecciona un producto"
                                >
                                    <ComboboxInput placeholder="Buscar producto..." />
                                    <ComboboxContent>
                                        <ComboboxItemsFiltered />
                                    </ComboboxContent>
                                </Combobox>
                                {errors.product_id && (
                                    <p className="text-sm text-red-500">{errors.product_id}</p>
                                )}
                            </div>

                            {/* Stock Actual */}
                            {selectedProduct && (
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Actual</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={selectedProduct.stock_actual}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Cantidad */}
                            <div className="space-y-2">
                                <Label htmlFor="cantidad">Cantidad a Agregar *</Label>
                                <Input
                                    id="cantidad"
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    value={data.cantidad}
                                    onChange={(e) => setData('cantidad', parseInt(e.target.value) || 1)}
                                    className={errors.cantidad ? 'border-red-500' : ''}
                                />
                                {errors.cantidad && (
                                    <p className="text-sm text-red-500">{errors.cantidad}</p>
                                )}
                            </div>

                            {/* Motivo */}
                            <div className="space-y-2">
                                <Label htmlFor="motivo">Motivo de Entrada *</Label>
                                <Select
                                    value={data.motivo}
                                    onValueChange={(value) => setData('motivo', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un motivo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOTIVOS.map((motivo) => (
                                            <SelectItem key={motivo.value} value={motivo.value}>
                                                {motivo.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.motivo && (
                                    <p className="text-sm text-red-500">{errors.motivo}</p>
                                )}
                            </div>
                        </div>

                        {/* Notas */}
                        <div className="space-y-2">
                            <Label htmlFor="notas">Notas (Opcional)</Label>
                            <textarea
                                id="notas"
                                placeholder="Agregar notas sobre esta entrada (ej: número de factura, proveedor)..."
                                value={data.notas as string}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('notas', e.target.value)}
                                rows={3}
                                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.notas && (
                                <p className="text-sm text-red-500">{errors.notas}</p>
                            )}
                        </div>

                        {/* Info de resumen */}
                        {selectedProduct && data.cantidad && (
                            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
                                <p className="text-sm">
                                    <span className="font-semibold">Resumen:</span> El stock actual de <strong>{selectedProduct.nombre}</strong> aumentará de <strong>{selectedProduct.stock_actual}</strong> a <strong>{selectedProduct.stock_actual + parseInt(data.cantidad as string)}</strong> unidades.
                                </p>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <Link href="/stock-movements">
                                <Button variant="outline">Cancelar</Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        Registrando...
                                    </>
                                ) : (
                                    'Registrar Entrada'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

StockMovementsEntry.layout = (page: React.ReactNode) => <AppLayout children={page} breadcrumbs={[
    { title: 'Movimientos de Stock', href: '/stock-movements' },
    { title: 'Registrar Entrada', href: '#' }
]} />;
