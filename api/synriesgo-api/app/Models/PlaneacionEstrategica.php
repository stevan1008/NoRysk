<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaneacionEstrategica extends Model
{
    protected $table = 'planeacion_estrategica';
    protected $primaryKey = "pes_pk_id";
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'pes_mision',
        'pes_vision'
    ];
}