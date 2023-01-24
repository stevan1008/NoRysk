<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class PlaneacionEstrategicaObjetivos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('planeacion_estrategica_objetivos', function (Blueprint $table) {
            $table->increments('peo_pk_id');
            $table->string('peo_objetivo', 1500);
            $table->boolean('peo_borrado')->default(false);
            $table->timestamps();

            $table->index('peo_borrado');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('planeacion_estrategica_objetivos');
    }
}
