<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Subprocesos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subprocesos', function (Blueprint $table) {
            $table->increments('spr_pk_id');
            $table->integer('mpc_fk_id');
            $table->integer('prc_fk_id');
            $table->string('spr_nombre', 300);
            $table->boolean('spr_borrado')->default(false);
            $table->timestamps();

            $table->foreign('mpc_fk_id')->references('mpc_pk_id')->on('macroprocesos');
            $table->foreign('prc_fk_id')->references('prc_pk_id')->on('procesos');

            $table->index(['mpc_fk_id', 'prc_fk_id', 'spr_borrado']);
            $table->index(['prc_fk_id', 'spr_borrado']);
            $table->index('spr_borrado');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subprocesos');
    }
}
