import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function StockIndex() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Stock Actual</h1>
                <Link href="/stock/low-stock">
                    <Button variant="outline">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Ver Bajo Stock
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg border bg-card p-6">
                <p className="text-muted-foreground">
                    Aquí irá el resumen del stock actual de todos los productos...
                </p>
            </div>
        </div>
    );
}

StockIndex.layout = (page: any) => <AppLayout children={page} breadcrumbs={[
    { label: 'Stock', href: '/stock' }
]} />;
