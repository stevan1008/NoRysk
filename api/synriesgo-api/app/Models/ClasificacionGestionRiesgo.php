<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CateogriaGestionRiesgo extends Model
{
    protected $table = 'clasificacion_gestion_riesgo';
    protected $primaryKey = "clr_pk_id";
    public $timestamps = false;
    public $incrementing = false;
}
