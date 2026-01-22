<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $informatica = Category::where('nombre', 'Informática')->first();
        $electronica = Category::where('nombre', 'Electrónica')->first();
        $accesorios = Category::where('nombre', 'Accesorios')->first();

        $products = [
            // Informática
            [
                'codigo' => 'LAP-001',
                'nombre' => 'Laptop Dell XPS 13',
                'descripcion' => 'Laptop ultraportátil 13 pulgadas',
                'category_id' => $informatica->id,
                'stock_actual' => 5,
                'stock_minimo' => 2,
                'activo' => true,
            ],
            [
                'codigo' => 'MON-001',
                'nombre' => 'Monitor LG 27"',
                'descripcion' => 'Monitor Full HD 27 pulgadas',
                'category_id' => $informatica->id,
                'stock_actual' => 3,
                'stock_minimo' => 2,
                'activo' => true,
            ],
            // Electrónica
            [
                'codigo' => 'TEL-001',
                'nombre' => 'Teléfono iPhone 15',
                'descripcion' => 'Smartphone iPhone última generación',
                'category_id' => $electronica->id,
                'stock_actual' => 1,
                'stock_minimo' => 3,
                'activo' => true,
            ],
            [
                'codigo' => 'AUD-001',
                'nombre' => 'Audífonos Sony WH1000',
                'descripcion' => 'Audífonos inalámbricos con cancelación de ruido',
                'category_id' => $electronica->id,
                'stock_actual' => 8,
                'stock_minimo' => 2,
                'activo' => true,
            ],
            // Accesorios
            [
                'codigo' => 'CAB-001',
                'nombre' => 'Cable USB-C',
                'descripcion' => 'Cable de carga y transferencia USB-C 2 metros',
                'category_id' => $accesorios->id,
                'stock_actual' => 25,
                'stock_minimo' => 10,
                'activo' => true,
            ],
            [
                'codigo' => 'FUND-001',
                'nombre' => 'Funda de laptop',
                'descripcion' => 'Funda protectora para laptop 15"',
                'category_id' => $accesorios->id,
                'stock_actual' => 2,
                'stock_minimo' => 5,
                'activo' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(
                ['codigo' => $product['codigo']],
                $product
            );
        }
    }
}
