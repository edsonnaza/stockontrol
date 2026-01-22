<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use App\Http\Requests\StoreStockMovementRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    /**
     * Display a listing of stock movements.
     */
    public function index()
    {
        $movements = StockMovement::with(['product', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        return Inertia::render('stock-movements/index', [
            'movements' => $movements,
        ]);
    }

    /**
     * Show the form for registering a stock entry.
     */
    public function entryForm()
    {
        $products = Product::where('activo', true)
            ->with('category')
            ->get();
        
        return Inertia::render('stock-movements/entry', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for registering a stock exit.
     */
    public function exitForm()
    {
        $products = Product::where('activo', true)
            ->with('category')
            ->get();
        
        return Inertia::render('stock-movements/exit', [
            'products' => $products,
        ]);
    }

    /**
     * Store a stock movement (entry or exit).
     */
    public function store(StoreStockMovementRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $validated['fecha'] = now();

        // Actualizar stock del producto
        $product = Product::findOrFail($validated['product_id']);
        
        if ($validated['tipo'] === 'entrada') {
            $product->increment('stock_actual', $validated['cantidad']);
        } elseif ($validated['tipo'] === 'salida') {
            $product->decrement('stock_actual', $validated['cantidad']);
        }

        // Crear el movimiento de stock
        StockMovement::create($validated);

        $tipo = $validated['tipo'] === 'entrada' ? 'Entrada' : 'Salida';
        
        return redirect()->route('stock-movements.index')
            ->with('success', "{$tipo} de stock registrada exitosamente");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockMovement $movement)
    {
        // Revertir el cambio de stock
        $product = $movement->product;
        
        if ($movement->tipo === 'entrada') {
            $product->decrement('stock_actual', $movement->cantidad);
        } elseif ($movement->tipo === 'salida') {
            $product->increment('stock_actual', $movement->cantidad);
        }

        $movement->delete();

        return redirect()->route('stock-movements.index')
            ->with('success', 'Movimiento de stock eliminado exitosamente');
    }
}
