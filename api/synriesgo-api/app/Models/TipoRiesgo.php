<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoRiesgo extends Model
{
    protected $table = 'tipo_riesgo';
    protected $primaryKey = "tpr_pk_id";
    public $timestamps = false;
    public $incrementing = false;
}
