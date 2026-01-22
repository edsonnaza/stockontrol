<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique()->comment('SKU o código del producto');
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->integer('stock_actual')->default(0)->comment('Stock actual disponible');
            $table->integer('stock_minimo')->default(5)->comment('Stock mínimo para alertas');
            $table->boolean('activo')->default(true);
            $table->timestamps();
            
            // Índices para mejorar búsquedas
            $table->index('codigo');
            $table->index('nombre');
            $table->index('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
