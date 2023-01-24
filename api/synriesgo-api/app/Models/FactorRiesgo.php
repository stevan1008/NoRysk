<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FactorRiesgo extends Model
{
    protected $table = 'factorRiesgo';
    protected $primaryKey = "far_pk_id";
    public $timestamps = false;
    public $incrementing = false;
}
