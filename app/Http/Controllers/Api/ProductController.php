<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            Product::with('category')->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();
        $validated['activo'] = $request->boolean('activo', true);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Producto creado exitosamente',
            'data' => $product->load('category'),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json($product->load('category'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreProductRequest $request, Product $product)
    {
        $validated = $request->validated();
        $validated['activo'] = $request->boolean('activo', true);

        $product->update($validated);

        return response()->json([
            'message' => 'Producto actualizado exitosamente',
            'data' => $product->load('category'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado exitosamente',
        ]);
    }

    /**
     * Get categories for dropdown.
     */
    public function getCategories()
    {
        return response()->json(
            Category::select('id', 'nombre')->get()
        );
    }
}
