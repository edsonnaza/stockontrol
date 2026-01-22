<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasPermissionTo('create products');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $product = $this->route('product');
        $uniqueRule = 'unique:products,codigo';
        
        // Si se está editando, ignorar el producto actual
        if ($product) {
            $uniqueRule .= ',' . $product->id;
        }
        
        return [
            'codigo' => ['required', 'string', $uniqueRule, 'max:50'],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string', 'max:1000'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'stock_actual' => ['required', 'integer', 'min:0'],
            'stock_minimo' => ['required', 'integer', 'min:0'],
            'activo' => ['boolean'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'codigo.required' => 'El código del producto es requerido',
            'codigo.unique' => 'El código ya existe',
            'nombre.required' => 'El nombre del producto es requerido',
            'stock_actual.required' => 'El stock actual es requerido',
            'stock_minimo.required' => 'El stock mínimo es requerido',
        ];
    }
}
