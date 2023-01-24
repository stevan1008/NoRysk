<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Clientes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->increments('cli_pk_id');
            $table->string('cli_razon_social', 500);
            $table->string('cli_rep_legal', 250);
            $table->string('cli_email', 100);
            $table->string('cli_direccion', 250);
            $table->integer('dep_fk_id');
            $table->integer('mun_fk_id');
            $table->date('cli_fecha_inicio');
            $table->date('cli_fecha_fin');
            $table->integer('cli_numero_sedes');

            $table->timestamps();

            $table->foreign('dep_fk_id')->references('dep_pk_id')->on('departamentos');
            $table->foreign('mun_fk_id')->references('mun_pk_id')->on('municipios');

            $table->index(['dep_fk_id', 'mun_fk_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gestion_contratos');
    }
}