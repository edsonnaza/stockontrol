<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    // Productos
    Route::apiResource('products', ProductController::class);
    Route::get('products-categories', [ProductController::class, 'getCategories']);
});
