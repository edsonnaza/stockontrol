<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'codigo',
        'nombre',
        'descripcion',
        'category_id',
        'stock_actual',
        'stock_minimo',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'stock_actual' => 'integer',
        'stock_minimo' => 'integer',
    ];

    /**
     * Obtener la categoría del producto
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Obtener los movimientos de stock de este producto
     */
    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Verificar si el stock está bajo el mínimo
     */
    public function isLowStock(): bool
    {
        return $this->stock_actual <= $this->stock_minimo;
    }

    /**
     * Obtener el estado del stock (para alertas)
     */
    public function getStockStatus(): string
    {
        if ($this->stock_actual <= 0) {
            return 'sin_stock';
        } elseif ($this->isLowStock()) {
            return 'bajo';
        }
        return 'normal';
    }
}
