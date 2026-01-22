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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->enum('tipo', ['entrada', 'salida'])->comment('Tipo de movimiento');
            $table->integer('cantidad');
            $table->date('fecha');
            $table->enum('motivo', ['compra', 'venta', 'ajuste', 'devolución', 'otro'])->default('otro');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('notas')->nullable();
            $table->timestamps();
            
            // Índices para mejorar búsquedas y reportes
            $table->index('product_id');
            $table->index('user_id');
            $table->index('fecha');
            $table->index('tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
