<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CategoriasGestionRiesgo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categoria_gest_riesgo', function (Blueprint $table) {
            $table->integer('cgr_pk_id');
            $table->string('cgr_desc', 500);

            $table->primary('cgr_pk_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categoria_gest_riesgo');
    }
}
