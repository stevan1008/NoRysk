<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImpactoRiesgo extends Model
{
    protected $table = 'impacto_riesgo';
    protected $primaryKey = "imp_pk_id";
    public $timestamps = false;
    public $incrementing = false;
}
