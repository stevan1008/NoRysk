<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TipoRiesgo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tipo_riesgo', function (Blueprint $table) {
            $table->integer('tpr_pk_id');
            $table->string('tpr_desc', 500);
            $table->string('tpr_tooltip')->nullable();

            $table->primary('tpr_pk_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tipo_riesgo');
    }
}