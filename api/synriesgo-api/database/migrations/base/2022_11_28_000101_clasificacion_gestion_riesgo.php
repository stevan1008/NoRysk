<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ClasificacionGestionRiesgo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clasificacion_gestion_riesgo', function (Blueprint $table) {
            $table->integer('clr_pk_id');
            $table->string('clr_desc', 500);
            $table->string('clr_tooltip')->nullable();

            $table->primary('clr_pk_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clasificacion_gestion_riesgo');
    }
}