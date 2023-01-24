<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Clientes;

class ClientesController extends Controller
{
    public function obtenerClientes(Request $request) {
        return Clientes::selectRaw('clientes.*, (now()::DATE <= cli_fecha_fin::DATE) as activo, (cli_fecha_fin::DATE - now()::DATE) as dias_habiles')
                       ->get()->toArray();
    }

    public function obtenerClientesActivos(Request $request) {
        return Clientes::selectRaw('clientes.*')
                       ->whereRaw('now()::DATE <= cli_fecha_fin::DATE')
                       ->orderBy('cli_razon_social')
                       ->get()->toArray();
    }

    public function verificarExistenciaIdentificador(Request $request, $identificador) {
        return Clientes::where('cli_id_cliente', $identificador)->count();
    }

    public function crearCliente(Request $request) {
        $datos = $request->input('datos');

        // Crear en nuevo cliente
        $id = Clientes::create(
            [
                'cli_razon_social' => $datos['cli_razon_social'],
                'cli_rep_legal' => $datos['cli_rep_legal'],
                'cli_email' => $datos['cli_email'],
                'cli_direccion' => $datos['cli_direccion'],
                'dep_fk_id' => $datos['dep_fk_id'],
                'mun_fk_id' => $datos['mun_fk_id'],
                'cli_fecha_inicio' => $datos['cli_fecha_inicio'],
                'cli_fecha_fin' => $datos['cli_fecha_fin'],
                'cli_numero_sedes' => $datos['cli_numero_sedes']
            ]
        )->cli_pk_id;

        // Crear el esquema en la base de datos
        \DB::statement('CREATE SCHEMA IF NOT EXISTS "'.$id.'"');

        // Crear una conexión temporal al esquema
        config([
            'database.connections.'.$id =>
            [
                'driver' => 'pgsql',
                'url' => env('DATABASE_URL'),
                'host' => env('DB_HOST', '127.0.0.1'),
                'port' => env('DB_PORT', '5432'),
                'database' => env('DB_DATABASE', 'synriesgo'),
                'username' => env('DB_USERNAME', 'postgres'),
                'password' => env('DB_PASSWORD', 'postgres'),
                'charset' => 'utf8',
                'prefix' => '',
                'prefix_indexes' => true,
                'schema' => $id,
                'sslmode' => 'prefer',
            ],
        ]);

        // Migrar las tablas del esquema
        \Artisan::call('migrate', ['--path' => 'database/migrations/clients', '--database' => $id, '--force' => true]);
        \Artisan::call('db:seed', ['--database' => $id, '--class' => 'ClientSeeder']);

        return ['response' => $id];
    }

    public function actualizarCliente(Request $request, $id) {
        $datos = $request->input('datos');

        Clientes::where('cli_pk_id', $id)
        ->update(
            [
                'cli_razon_social' => $datos['cli_razon_social'],
                'cli_rep_legal' => $datos['cli_rep_legal'],
                'cli_email' => $datos['cli_email'],
                'cli_direccion' => $datos['cli_direccion'],
                'dep_fk_id' => $datos['dep_fk_id'],
                'mun_fk_id' => $datos['mun_fk_id'],
                'cli_fecha_inicio' => $datos['cli_fecha_inicio'],
                'cli_fecha_fin' => $datos['cli_fecha_fin'],
                'cli_numero_sedes' => $datos['cli_numero_sedes']
            ]
        );

        return ['response' => 1];
    }
}
