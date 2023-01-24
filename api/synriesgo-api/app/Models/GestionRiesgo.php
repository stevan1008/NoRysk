<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GestionRiesgo extends Model
{
    protected $table = 'gestion_riesgo';
    protected $primaryKey = "ger_pk_id";
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'sed_fk_id',
        'prc_fk_id',
        'spr_fk_id',
        'cgr_fk_id',
        'clr_fk_id',
        'tpr_fk_id',
        'ger_fallo_riesgo_0',
        'ger_fallo_riesgo_1',
        'ger_fallo_riesgo_2',
        'ger_fallo_riesgo_3',
        'ger_fallo_riesgo_4',
        'ger_fallo_riesgo_5',
        'ger_fallo_riesgo_6',
        'ger_fallo_riesgo_7',
        'ger_fallo_riesgo_8',
        'ger_fallo_riesgo_9',
        'ger_fallo_riesgo_10',
        'ger_fallo_riesgo_11',
        'ger_fallo_riesgo_12',
        'ger_fallo_riesgo_13',
        'ger_fallo_riesgo_14',
        'ger_fallo_riesgo_15',
        'ger_fallo_riesgo_16',
        'ger_fallo_riesgo_17',
        'ger_fallo_riesgo_18',
        'ger_fallo_riesgo_19',
        'ger_fallo_riesgo_20',
        'ger_fallo_riesgo_21',
        'ger_fallo_riesgo_22',
        'ger_fallo_riesgo_23',
        'ger_fallo_riesgo_24',
        'far_fk_id',
        'ger_desc_materializacion',
        'ger_activo_afectado',
        'ger_pilares_afectados_1',
        'ger_pilares_afectados_2',
        'ger_pilares_afectados_3',
        'prb_fk_id',
        'imp_fk_id',
        'ger_borrado',
    ];
}