<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $macroprocesos = json_decode(\File::get(storage_path('dbParams/macroprocesos.json')), true);
        \DB::table('macroprocesos')->insert($macroprocesos);
    }
}
