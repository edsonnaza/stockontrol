import { Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Loader } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';

interface EditProps {
    product: {
        id: number;
        codigo: string;
        nombre: string;
        descripcion: string | null;
        category_id: number | null;
        stock_actual: number;
        stock_minimo: number;
        activo: boolean;
    };
    categories: Array<{
        id: number;
        nombre: string;
    }>;
}

export default function ProductsEdit({ product, categories }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        codigo: product.codigo,
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        category_id: product.category_id?.toString() || '',
        stock_actual: product.stock_actual,
        stock_minimo: product.stock_minimo,
        activo: product.activo,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/products/${product.id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/products">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <Heading
                    title="Editar Producto"
                    description="Actualiza los datos del producto"
                />
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Código */}
                            <div className="space-y-2">
                                <Label htmlFor="codigo">Código / SKU *</Label>
                                <Input
                                    id="codigo"
                                    placeholder="SKU123"
                                    value={data.codigo}
                                    onChange={(e) => setData('codigo', e.target.value)}
                                    className={errors.codigo ? 'border-red-500' : ''}
                                />
                                {errors.codigo && (
                                    <p className="text-sm text-red-500">{errors.codigo}</p>
                                )}
                            </div>

                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="nombre">Nombre del Producto *</Label>
                                <Input
                                    id="nombre"
                                    placeholder="Nombre del producto"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className={errors.nombre ? 'border-red-500' : ''}
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-500">{errors.nombre}</p>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <textarea
                                id="descripcion"
                                placeholder="Descripción del producto (opcional)"
                                value={data.descripcion as string}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('descripcion', e.target.value)}
                                rows={4}
                                className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {errors.descripcion && (
                                <p className="text-sm text-red-500">{errors.descripcion}</p>
                            )}
                        </div>

                        {/* Categoría */}
                        <div className="space-y-2">
                            <Label htmlFor="category_id">Categoría</Label>
                            <Select
                                value={data.category_id.toString()}
                                onValueChange={(value) => setData('category_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && (
                                <p className="text-sm text-red-500">{errors.category_id}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Stock Actual */}
                            <div className="space-y-2">
                                <Label htmlFor="stock_actual">Stock Actual *</Label>
                                <Input
                                    id="stock_actual"
                                    type="number"
                                    placeholder="0"
                                    value={data.stock_actual}
                                    onChange={(e) => setData('stock_actual', parseInt(e.target.value) || 0)}
                                    className={errors.stock_actual ? 'border-red-500' : ''}
                                />
                                {errors.stock_actual && (
                                    <p className="text-sm text-red-500">{errors.stock_actual}</p>
                                )}
                            </div>

                            {/* Stock Mínimo */}
                            <div className="space-y-2">
                                <Label htmlFor="stock_minimo">Stock Mínimo *</Label>
                                <Input
                                    id="stock_minimo"
                                    type="number"
                                    placeholder="5"
                                    value={data.stock_minimo}
                                    onChange={(e) => setData('stock_minimo', parseInt(e.target.value) || 0)}
                                    className={errors.stock_minimo ? 'border-red-500' : ''}
                                />
                                {errors.stock_minimo && (
                                    <p className="text-sm text-red-500">{errors.stock_minimo}</p>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-3 pt-4">
                            <Link href="/products">
                                <Button variant="outline">Cancelar</Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                                        Actualizando...
                                    </>
                                ) : (
                                    'Actualizar Producto'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

ProductsEdit.layout = (page: React.ReactNode) => <AppLayout children={page} breadcrumbs={[
    { title: 'Productos', href: '/products' },
    { title: 'Editar', href: '#' }
]} />;
