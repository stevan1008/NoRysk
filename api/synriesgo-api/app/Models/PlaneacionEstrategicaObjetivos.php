<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaneacionEstrategicaObjetivos extends Model
{
    protected $table = 'planeacion_estrategica_objetivos';
    protected $primaryKey = "peo_pk_id";
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'peo_objetivo',
        'peo_borrado'
    ];
}