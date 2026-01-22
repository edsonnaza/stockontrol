import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function StockMovementsExit() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/stock-movements">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Registrar Salida de Stock</h1>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <p className="text-muted-foreground">
                    Aquí irá el formulario para registrar una salida de stock...
                </p>
            </div>
        </div>
    );
}

StockMovementsExit.layout = (page: any) => <AppLayout children={page} breadcrumbs={[
    { label: 'Movimientos de Stock', href: '/stock-movements' },
    { label: 'Registrar Salida' }
]} />;
