import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function StockLowStock() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/stock">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Productos con Bajo Stock</h1>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <p className="text-muted-foreground">
                    Aquí irán los productos con stock por debajo del mínimo...
                </p>
            </div>
        </div>
    );
}

StockLowStock.layout = (page: any) => <AppLayout children={page} breadcrumbs={[
    { label: 'Stock', href: '/stock' },
    { label: 'Bajo Stock' }
]} />;
