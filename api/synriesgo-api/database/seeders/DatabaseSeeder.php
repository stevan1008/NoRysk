<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $roles = json_decode(\File::get(storage_path('dbParams/roles.json')), true);
        \DB::table('roles')->insert($roles);

        $tiposDocumento = json_decode(\File::get(storage_path('dbParams/tiposDocumento.json')), true);
        \DB::table('tipos_documento')->insert($tiposDocumento);

        $passwordReset = User::create([
            'name' => 'Password resets',
            'email' => 'password_resets@myapi',
            'password' => bcrypt('ndedsboeiowa@¡?acmhjobspmkwdrun$%'),
            'email_verified_at' => date('Y-m-d h:i:s')
        ]);

        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'a@a.com',
            'password' => bcrypt('prueba1*'),
            'email_verified_at' => date('Y-m-d h:i:s'),
            'rol_fk_id' => 1
        ]);

        $departamentos = json_decode(\File::get(storage_path('dbParams/departamentos.json')), true);
        \DB::table('departamentos')->insert($departamentos);

        $municipios = json_decode(\File::get(storage_path('dbParams/municipios.json')), true);
        \DB::table('municipios')->insert($municipios);

        $categoriasGestionRiesgo = json_decode(\File::get(storage_path('dbParams/categoriaGestionRiesgo.json')), true);
        \DB::table('categoria_gest_riesgo')->insert($categoriasGestionRiesgo);
        
        $clasificacionGestionRiesgo = json_decode(\File::get(storage_path('dbParams/clasificacionGestionRiesgo.json')), true);
        \DB::table('clasificacion_gestion_riesgo')->insert($clasificacionGestionRiesgo);

        $tipoRiesgo = json_decode(\File::get(storage_path('dbParams/tipoRiesgo.json')), true);
        \DB::table('tipo_riesgo')->insert($tipoRiesgo); 

        $factorRiesgo = json_decode(\File::get(storage_path('dbParams/factorRiesgo.json')), true);
        \DB::table('factor_riesgo')->insert($factorRiesgo); 

        $probabilidades = json_decode(\File::get(storage_path('dbParams/probabilidad.json')), true);
        \DB::table('probabilidades_riesgo')->insert($probabilidades);

        $impacto = json_decode(\File::get(storage_path('dbParams/impacto.json')), true);
        \DB::table('impacto_riesgo')->insert($impacto);

        $tipoControl = json_decode(\File::get(storage_path('dbParams/tipoControl.json')), true);
        \DB::table('tipo_control')->insert($tipoControl);
        
        $naturalezaControl = json_decode(\File::get(storage_path('dbParams/naturalezaControl.json')), true);
        \DB::table('naturaleza_control')->insert($naturalezaControl);
        
        $periodicidadControl = json_decode(\File::get(storage_path('dbParams/periodicidadControl.json')), true);
        \DB::table('periodicidad_control')->insert($periodicidadControl);

        $disenoControl = json_decode(\File::get(storage_path('dbParams/disenoControl.json')), true);
        \DB::table('diseno_control')->insert($disenoControl);

        $ejecucionControl = json_decode(\File::get(storage_path('dbParams/ejecucionControl.json')), true);
        \DB::table('ejecucion_control')->insert($ejecucionControl); 

        $efectividadControl = json_decode(\File::get(storage_path('dbParams/efectividadControl.json')), true);
        \DB::table('efectividad_control')->insert($efectividadControl);
        

        $fortalezaControl = json_decode(\File::get(storage_path('dbParams/fortalezaControl.json')), true);
        \DB::table('fortaleza_control')->insert($fortalezaControl);
    }
}
