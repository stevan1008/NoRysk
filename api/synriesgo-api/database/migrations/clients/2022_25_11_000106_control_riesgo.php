<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ControlRiesgo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('control_riesgo', function (Blueprint $table) {
            $table->increments('cri_pk_id');
            $table->integer('ger_fk_id'); 
            $table->string('cri_desc', 1000);
            $table->integer('cgr_fk_id'); 
            $table->string('cri_responsable', 500);
            $table->integer('tdc_fk_id');  
            $table->integer('nac_fk_id');  
            $table->integer('pec_fk_id'); 
            $table->string('cri_ref_control', 2000);
            $table->integer('cri_mitiga_1')->nullable();
            $table->integer('cri_mitiga_2')->nullable();
            $table->integer('cri_seg_cont_1')->nullable();
            $table->integer('cri_seg_cont_2')->nullable();
            $table->integer('cri_seg_cont_3')->nullable();
            $table->integer('cri_apl_control_1')->nullable();
            $table->integer('cri_apl_control_2')->nullable();
            $table->string('cri_apl_control_otro', 500)->nullable();
            $table->integer('dic_fk_id'); 
            $table->integer('ejc_fk_id');  
            $table->integer('efc_fk_id'); 
            $table->integer('foc_fk_id'); 
            $table->boolean('cri_borrado')->default(false)->nullable();
            $table->timestamps();

            // Foreigns Keys
            $table->foreign('ger_fk_id')->references('ger_pk_id')->on('gestion_riesgo');
            $table->foreign('cgr_fk_id')->references('cgr_pk_id')->on('categoria_gest_riesgo');
            $table->foreign('tdc_fk_id')->references('tdc_pk_id')->on('tipo_control');
            $table->foreign('nac_fk_id')->references('nac_pk_id')->on('naturaleza_control');
            $table->foreign('pec_fk_id')->references('pec_pk_id')->on('periodicidad_control');
            $table->foreign('dic_fk_id')->references('dic_pk_id')->on('diseno_control');
            $table->foreign('ejc_fk_id')->references('ejc_pk_id')->on('ejecucion_control');
            $table->foreign('efc_fk_id')->references('efc_pk_id')->on('efectividad_control');
            $table->foreign('foc_fk_id')->references('foc_pk_id')->on('fortaleza_control');
            
            // Index
            $table->index(['ger_fk_id', 'cri_borrado']);
            $table->index('cri_borrado');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('control_riesgo');
    }
}