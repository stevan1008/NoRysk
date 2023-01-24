<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ProbabilidadesRiesgo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('probabilidades_riesgo', function (Blueprint $table) {
            $table->integer('prb_pk_id');
            $table->string('prb_desc');
            $table->string('prb_tooltip')->nullable();

            $table->primary('prb_pk_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('probabilidades_riesgo');
    }
}