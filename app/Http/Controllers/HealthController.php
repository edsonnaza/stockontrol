<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Product;

class HealthController extends Controller
{
    public function check()
    {
        try {
            // Verificar conexión a base de datos
            DB::connection()->getPdo();
            
            $userCount = User::count();
            $productCount = Product::count();
            $adminExists = User::where('email', 'admin@stockontrol.com')->exists();

            return response()->json([
                'status' => 'ok',
                'database' => 'connected',
                'users' => $userCount,
                'products' => $productCount,
                'admin_created' => $adminExists,
                'timestamp' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
