<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CateogriaGestionRiesgo extends Model
{
    protected $table = 'categoria_gestion_riesgo';
    protected $primaryKey = "cgr_pk_id";
    public $timestamps = false;
    public $incrementing = false;
}
