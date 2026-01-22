<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar caché de roles y permisos
        app()['cache']->forget('spatie.permission.cache');

        // Crear permisos
        $permissions = [
            // Productos
            'view products',
            'create products',
            'edit products',
            'delete products',

            // Categorías
            'view categories',
            'create categories',
            'edit categories',
            'delete categories',

            // Proveedores
            'view suppliers',
            'create suppliers',
            'edit suppliers',
            'delete suppliers',

            // Movimientos de stock
            'view stock movements',
            'create stock movements',
            'edit stock movements',
            'delete stock movements',

            // Reportes
            'view reports',
            'export reports',

            // Usuarios
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Roles y permisos
            'manage roles',
            'manage permissions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Crear rol Administrador
        $adminRole = Role::firstOrCreate(['name' => 'administrador']);
        $adminRole->syncPermissions($permissions);

        // Crear rol Supervisor
        $supervisorRole = Role::firstOrCreate(['name' => 'supervisor']);
        $supervisorPermissions = [
            'view products',
            'create products',
            'edit products',
            'view categories',
            'view suppliers',
            'view stock movements',
            'create stock movements',
            'view reports',
            'export reports',
            'view users',
        ];
        $supervisorRole->syncPermissions($supervisorPermissions);

        // Crear rol Empleado
        $employeeRole = Role::firstOrCreate(['name' => 'empleado']);
        $employeePermissions = [
            'view products',
            'view categories',
            'view suppliers',
            'view stock movements',
            'create stock movements',
        ];
        $employeeRole->syncPermissions($employeePermissions);
    }
}
