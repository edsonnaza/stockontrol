<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStockMovementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'tipo' => ['required', 'in:entrada,salida'],
            'cantidad' => ['required', 'integer', 'min:1'],
            'motivo' => ['required', 'in:compra,venta,ajuste,devolución,otro'],
            'notas' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'El producto es requerido',
            'product_id.exists' => 'El producto seleccionado no existe',
            'tipo.required' => 'El tipo de movimiento es requerido',
            'cantidad.required' => 'La cantidad es requerida',
            'cantidad.min' => 'La cantidad debe ser mayor a 0',
            'motivo.required' => 'El motivo es requerido',
        ];
    }
}
