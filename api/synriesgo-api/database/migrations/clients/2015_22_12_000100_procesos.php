<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Procesos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('procesos', function (Blueprint $table) {
            $table->increments('prc_pk_id');
            $table->integer('mpc_fk_id');
            $table->string('prc_nombre', 300);
            $table->boolean('prc_asignado')->default(false);
            $table->boolean('prc_borrado')->default(false);
            $table->timestamps();

            $table->foreign('mpc_fk_id')->references('mpc_pk_id')->on('macroprocesos');

            $table->index(['mpc_fk_id', 'prc_borrado']);
            $table->index('prc_borrado');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('procesos');
    }
}
