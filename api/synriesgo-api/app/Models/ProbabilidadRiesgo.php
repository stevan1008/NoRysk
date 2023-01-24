<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProbabilidadRiesgo extends Model
{
    protected $table = 'probabilidades_riesgo';
    protected $primaryKey = "prb_pk_id";
    public $timestamps = false;
    public $incrementing = false;
}
