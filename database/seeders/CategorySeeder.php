<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['nombre' => 'Electrónica', 'descripcion' => 'Productos electrónicos en general'],
            ['nombre' => 'Informática', 'descripcion' => 'Computadoras, accesorios y periféricos'],
            ['nombre' => 'Accesorios', 'descripcion' => 'Accesorios y cables'],
            ['nombre' => 'Ropa', 'descripcion' => 'Prendas de vestir'],
            ['nombre' => 'Alimentos', 'descripcion' => 'Productos alimenticios'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(
                ['nombre' => $category['nombre']],
                ['descripcion' => $category['descripcion']]
            );
        }
    }
}
