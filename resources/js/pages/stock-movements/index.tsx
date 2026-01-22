import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function StockMovementsIndex() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Historial de Movimientos</h1>
                <div className="flex gap-2">
                    <Link href="/stock-movements/entry">
                        <Button variant="outline">
                            <Plus className="mr-2 h-4 w-4" />
                            Entrada
                        </Button>
                    </Link>
                    <Link href="/stock-movements/exit">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Salida
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <p className="text-muted-foreground">
                    Aquí irá el historial de movimientos de stock...
                </p>
            </div>
        </div>
    );
}

StockMovementsIndex.layout = (page: any) => <AppLayout children={page} breadcrumbs={[
    { label: 'Movimientos de Stock', href: '/stock-movements' }
]} />;
