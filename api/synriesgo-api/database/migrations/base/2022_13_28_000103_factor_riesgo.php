<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FactorRiesgo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('factor_riesgo', function (Blueprint $table) {
            $table->integer('far_pk_id');
            $table->string('far_desc');
            $table->string('far_tooltip', 1000)->nullable();

            $table->primary('far_pk_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('factor_riesgo');
    }
}