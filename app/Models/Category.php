<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    /**
     * Obtener los productos de esta categoría
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
