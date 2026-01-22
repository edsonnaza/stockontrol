<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id',
        'tipo',
        'cantidad',
        'fecha',
        'motivo',
        'user_id',
        'notas',
    ];

    protected $casts = [
        'fecha' => 'date',
        'cantidad' => 'integer',
    ];

    /**
     * Obtener el producto asociado
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Obtener el usuario que registró el movimiento
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtener el tipo de movimiento en español formateado
     */
    public function getTipoFormato(): string
    {
        return match($this->tipo) {
            'entrada' => 'Entrada',
            'salida' => 'Salida',
            default => $this->tipo,
        };
    }

    /**
     * Obtener el motivo formateado
     */
    public function getMotivoFormato(): string
    {
        return match($this->motivo) {
            'compra' => 'Compra',
            'venta' => 'Venta',
            'ajuste' => 'Ajuste',
            'devolución' => 'Devolución',
            'otro' => 'Otro',
            default => $this->motivo,
        };
    }
}
