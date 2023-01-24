<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class GestionRiesgo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gestion_riesgo', function (Blueprint $table) {
            $table->increments('ger_pk_id');
            $table->integer('sed_fk_id');
            $table->integer('prc_fk_id');
            $table->integer('spr_fk_id'); 
            $table->integer('cgr_fk_id');
            $table->integer('clr_fk_id');
            $table->integer('tpr_fk_id');
            $table->integer('ger_fallo_riesgo_0')->nullable();
            $table->integer('ger_fallo_riesgo_1')->nullable();
            $table->integer('ger_fallo_riesgo_2')->nullable();
            $table->integer('ger_fallo_riesgo_3')->nullable();
            $table->integer('ger_fallo_riesgo_4')->nullable();
            $table->integer('ger_fallo_riesgo_5')->nullable();
            $table->integer('ger_fallo_riesgo_6')->nullable();
            $table->integer('ger_fallo_riesgo_7')->nullable();
            $table->integer('ger_fallo_riesgo_8')->nullable();
            $table->integer('ger_fallo_riesgo_9')->nullable();
            $table->integer('ger_fallo_riesgo_10')->nullable();
            $table->integer('ger_fallo_riesgo_11')->nullable();
            $table->integer('ger_fallo_riesgo_12')->nullable();
            $table->integer('ger_fallo_riesgo_13')->nullable();
            $table->integer('ger_fallo_riesgo_14')->nullable();
            $table->integer('ger_fallo_riesgo_15')->nullable();
            $table->integer('ger_fallo_riesgo_16')->nullable();
            $table->integer('ger_fallo_riesgo_17')->nullable();
            $table->integer('ger_fallo_riesgo_18')->nullable();
            $table->integer('ger_fallo_riesgo_19')->nullable();
            $table->integer('ger_fallo_riesgo_20')->nullable();
            $table->integer('ger_fallo_riesgo_21')->nullable();
            $table->integer('ger_fallo_riesgo_22')->nullable();
            $table->integer('ger_fallo_riesgo_23')->nullable();
            $table->integer('ger_fallo_riesgo_24')->nullable();
            $table->integer('far_fk_id');
            $table->string('ger_desc_materializacion');
            $table->string('ger_activo_afectado');
            $table->integer('ger_pilares_afectados_1')->nullable();
            $table->integer('ger_pilares_afectados_2')->nullable();
            $table->integer('ger_pilares_afectados_3')->nullable();
            $table->integer('prb_fk_id');
            $table->integer('imp_fk_id');
            $table->boolean('ger_borrado')->default(false)->nullable();
            $table->timestamps();

            // Foreigns Keys
            $table->foreign('prc_fk_id')->references('prc_pk_id')->on('procesos');
            $table->foreign('spr_fk_id')->references('spr_pk_id')->on('subprocesos');
            $table->foreign('cgr_fk_id')->references('cgr_pk_id')->on('categoria_gest_riesgo');
            $table->foreign('clr_fk_id')->references('clr_pk_id')->on('clasificacion_gestion_riesgo');
            $table->foreign('tpr_fk_id')->references('tpr_pk_id')->on('tipo_riesgo');
            $table->foreign('far_fk_id')->references('far_pk_id')->on('factor_riesgo');
            $table->foreign('prb_fk_id')->references('prb_pk_id')->on('probabilidades_riesgo');
            $table->foreign('imp_fk_id')->references('imp_pk_id')->on('impacto_riesgo');

            // Index
            $table->index(['prc_fk_id', 'prc_borrado']);
            $table->index('ger_borrado');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gestion_riesgo');
    }
}