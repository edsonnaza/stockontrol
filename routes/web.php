<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProductController;

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
        Route::get('/', function () {
            return Inertia::render('stock-movements/index');
        })->name('index');
        Route::get('entry', function () {
            return Inertia::render('stock-movements/entry');
        })->name('entry');
        Route::get('exit', function () {
            return Inertia::render('stock-movements/exit');
        })->name('exit');
    });

    // Stock / Alertas
    Route::prefix('stock')->name('stock.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('stock/index');
        })->name('index');
        Route::get('low-stock', function () {
            return Inertia::render('stock/low-stock');
        })->name('low-stock');
    });
});

require __DIR__.'/settings.php';
