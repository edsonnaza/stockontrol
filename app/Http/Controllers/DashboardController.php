<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $totalProducts = Product::where('activo', true)->count();
        $lowStockCount = Product::where('activo', true)
            ->where(function ($query) {
                $query->whereRaw('stock_actual <= stock_minimo')
                    ->orWhere('stock_actual', 0);
            })
            ->count();
        $noStockCount = Product::where('activo', true)
            ->where('stock_actual', 0)
            ->count();
        $totalValue = Product::where('activo', true)->sum('stock_actual');

        // Datos para gráfico de stock por categoría
        $stockByCategory = Product::where('activo', true)
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.nombre', DB::raw('SUM(products.stock_actual) as stock'))
            ->groupBy('categories.id', 'categories.nombre')
            ->get()
            ->map(fn($item) => [
                'name' => $item->nombre,
                'value' => $item->stock,
            ])
            ->toArray();

        // Últimos movimientos (últimos 7 días)
        $recentMovements = StockMovement::select(DB::raw('DATE(fecha) as date'), 'tipo', DB::raw('COUNT(*) as count'))
            ->where('fecha', '>=', now()->subDays(7))
            ->groupBy(DB::raw('DATE(fecha)'), 'tipo')
            ->orderBy('date')
            ->get()
            ->groupBy('date')
            ->map(function ($group) {
                $entradas = $group->where('tipo', 'entrada')->sum('count') ?? 0;
                $salidas = $group->where('tipo', 'salida')->sum('count') ?? 0;
                return [
                    'date' => $group->first()->date,
                    'Entradas' => $entradas,
                    'Salidas' => $salidas,
                ];
            })
            ->values()
            ->toArray();

        // Productos con bajo stock (top 5)
        $lowStockProducts = Product::where('activo', true)
            ->where(function ($query) {
                $query->whereRaw('stock_actual <= stock_minimo')
                    ->orWhere('stock_actual', 0);
            })
            ->orderBy('stock_actual', 'asc')
            ->limit(5)
            ->get(['nombre', 'stock_actual', 'stock_minimo'])
            ->map(fn($p) => [
                'name' => $p->nombre,
                'actual' => $p->stock_actual,
                'minimo' => $p->stock_minimo,
            ])
            ->toArray();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_products' => $totalProducts,
                'low_stock' => $lowStockCount,
                'no_stock' => $noStockCount,
                'total_items' => $totalValue,
            ],
            'stockByCategory' => $stockByCategory,
            'recentMovements' => $recentMovements,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
