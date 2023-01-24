<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Procesos extends Model
{
    protected $table = 'procesos';
    protected $primaryKey = "prc_pk_id";
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'mpc_fk_id',
        'prc_nombre',
        'prc_asignado',
        'prc_borrado'
    ];
}