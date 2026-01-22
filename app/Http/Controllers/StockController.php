<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class StockController extends Controller
{
    /**
     * Display low stock products.
     */
    public function lowStock()
    {
        $products = Product::with('category')
            ->where(function ($query) {
                $query->whereRaw('stock_actual <= stock_minimo')
                    ->orWhere('stock_actual', 0);
            })
            ->where('activo', true)
            ->orderBy('stock_actual', 'asc')
            ->paginate(20);

        return Inertia::render('stock/low-stock', [
            'products' => $products,
        ]);
    }

    /**
     * Display stock index/dashboard.
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

        return Inertia::render('stock/index', [
            'stats' => [
                'total_products' => $totalProducts,
                'low_stock' => $lowStockCount,
                'no_stock' => $noStockCount,
                'total_items' => $totalValue,
            ],
        ]);
    }
}
