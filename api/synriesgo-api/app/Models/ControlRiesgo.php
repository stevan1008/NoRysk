<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ControlRiesgo extends Model
{
    protected $table = 'control_riesgo';
    protected $primaryKey = "cri_pk_id";
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'ger_fk_id',
        'cri_desc',
        'cgr_fk_id',
        'cri_responsable',
        'tdc_fk_id',
        'nac_fk_id',
        'pec_fk_id',
        'cri_ref_control',
        'cri_mitiga_1',
        'cri_mitiga_2',
        'cri_seg_cont_1',
        'cri_seg_cont_2',
        'cri_seg_cont_3',
        'cri_apl_control_1',
        'cri_apl_control_2',
        'cri_apl_control_otro',
        'dic_fk_id',
        'ejc_fk_id',
        'efc_fk_id',
        'foc_fk_id',
        'cri_borrado',
    ];
}