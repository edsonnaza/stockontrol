<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario Administrador
        $admin = User::firstOrCreate(
            ['email' => 'admin@stockontrol.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('administrador');

        // Crear usuario Supervisor
        $supervisor = User::firstOrCreate(
            ['email' => 'supervisor@stockontrol.com'],
            [
                'name' => 'Supervisor',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $supervisor->assignRole('supervisor');

        // Crear usuario Empleado
        $employee = User::firstOrCreate(
            ['email' => 'empleado@stockontrol.com'],
            [
                'name' => 'Empleado',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $employee->assignRole('empleado');
    }
}
