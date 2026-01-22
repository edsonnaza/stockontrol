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
        // Datos de categorías (distribución)
        $categoryDistribution = Product::where('activo', true)
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.nombre', DB::raw('COUNT(*) as cantidad'))
            ->groupBy('categories.id', 'categories.nombre')
            ->get()
            ->map(fn($item) => [
                'name' => $item->nombre,
                'value' => $item->cantidad,
            ])
            ->toArray();

        // Últimos movimientos (últimos 10)
        $recentMovements = StockMovement::with('product', 'user')
            ->orderBy('fecha', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($movement) => [
                'id' => $movement->id,
                'producto' => $movement->product->nombre ?? 'N/A',
                'tipo' => $movement->tipo,
                'cantidad' => $movement->cantidad,
                'usuario' => $movement->user->name ?? 'N/A',
                'fecha' => \Carbon\Carbon::parse($movement->fecha)->format('d/m/Y H:i'),
                'motivo' => $movement->motivo,
            ])
            ->toArray();

        // Análisis de movimientos diarios (últimos 14 días)
        $movementsTrend = StockMovement::select(
            DB::raw('DATE(fecha) as date'),
            'tipo',
            DB::raw('COUNT(*) as cantidad')
        )
            ->where('fecha', '>=', now()->subDays(14))
            ->groupBy(DB::raw('DATE(fecha)'), 'tipo')
            ->orderBy('date')
            ->get()
            ->groupBy('date')
            ->map(function ($group) {
                $date = $group->first()->date;
                $entradas = $group->where('tipo', 'entrada')->sum('cantidad') ?? 0;
                $salidas = $group->where('tipo', 'salida')->sum('cantidad') ?? 0;
                return [
                    'date' => \Carbon\Carbon::createFromFormat('Y-m-d', $date)->format('d/m'),
                    'Entradas' => $entradas,
                    'Salidas' => $salidas,
                ];
            })
            ->values()
            ->toArray();

        // Productos más movidos (rotación)
        $topMovedProducts = StockMovement::select(
            'product_id',
            DB::raw('COUNT(*) as movimientos'),
            DB::raw('SUM(cantidad) as cantidad_total')
        )
            ->where('fecha', '>=', now()->subDays(30))
            ->groupBy('product_id')
            ->orderBy('movimientos', 'desc')
            ->limit(5)
            ->with('product')
            ->get()
            ->map(fn($item) => [
                'name' => $item->product->nombre ?? 'N/A',
                'movimientos' => $item->movimientos,
                'cantidad' => $item->cantidad_total,
            ])
            ->toArray();

        // KPIs principales
        $totalMovimientos = StockMovement::where('fecha', '>=', now()->subDays(30))->count();
        $totalEntradas = StockMovement::where('tipo', 'entrada')
            ->where('fecha', '>=', now()->subDays(30))
            ->sum('cantidad');
        $totalSalidas = StockMovement::where('tipo', 'salida')
            ->where('fecha', '>=', now()->subDays(30))
            ->sum('cantidad');

        // Rotación promedio
        $rotacionPromedio = Product::where('activo', true)->count() > 0
            ? round($totalMovimientos / Product::where('activo', true)->count(), 1)
            : 0;

        return Inertia::render('dashboard', [
            'kpis' => [
                'total_movimientos' => $totalMovimientos,
                'total_entradas' => $totalEntradas,
                'total_salidas' => $totalSalidas,
                'rotacion_promedio' => $rotacionPromedio,
            ],
            'categoryDistribution' => $categoryDistribution,
            'recentMovements' => $recentMovements,
            'movementsTrend' => $movementsTrend,
            'topMovedProducts' => $topMovedProducts,
        ]);
    }
}
