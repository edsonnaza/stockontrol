<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StockMovement;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;

class StockMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@stockontrol.com')->first();
        $supervisor = User::where('email', 'supervisor@stockontrol.com')->first();
        
        $products = Product::all();

        // Crear algunos movimientos de ejemplo
        $movements = [];

        foreach ($products as $index => $product) {
            // Entrada inicial
            $movements[] = [
                'product_id' => $product->id,
                'tipo' => 'entrada',
                'cantidad' => $product->stock_actual,
                'fecha' => Carbon::now()->subDays(30),
                'motivo' => 'compra',
                'user_id' => $admin->id,
                'notas' => 'Compra inicial al proveedor',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];

            // Una salida si el producto tiene stock
            if ($product->stock_actual > 0) {
                $movements[] = [
                    'product_id' => $product->id,
                    'tipo' => 'salida',
                    'cantidad' => max(1, intval($product->stock_actual * 0.3)),
                    'fecha' => Carbon::now()->subDays(10),
                    'motivo' => 'venta',
                    'user_id' => $supervisor->id,
                    'notas' => 'Venta a cliente',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }

            // Un ajuste
            if ($index % 2 == 0) {
                $movements[] = [
                    'product_id' => $product->id,
                    'tipo' => 'entrada',
                    'cantidad' => 2,
                    'fecha' => Carbon::now()->subDays(5),
                    'motivo' => 'ajuste',
                    'user_id' => $admin->id,
                    'notas' => 'Ajuste de inventario',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }
        }

        foreach ($movements as $movement) {
            StockMovement::create($movement);
        }
    }
}
