<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\StockController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Productos
    Route::resource('products', ProductController::class);

    // Movimientos de Stock
    Route::prefix('stock-movements')->name('stock-movements.')->group(function () {
        Route::get('/', [StockMovementController::class, 'index'])->name('index');
        Route::get('entry', [StockMovementController::class, 'entryForm'])->name('entry');
        Route::get('exit', [StockMovementController::class, 'exitForm'])->name('exit');
        Route::post('/', [StockMovementController::class, 'store'])->name('store');
        Route::delete('{movement}', [StockMovementController::class, 'destroy'])->name('destroy');
    });

    // Stock / Alertas
    Route::prefix('stock')->name('stock.')->group(function () {
        Route::get('/', [StockController::class, 'index'])->name('index');
        Route::get('low-stock', [StockController::class, 'lowStock'])->name('low-stock');
    });
});

require __DIR__.'/settings.php';
