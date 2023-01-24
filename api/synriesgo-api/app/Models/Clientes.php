<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clientes extends Model
{
    protected $table = 'clientes';
    protected $primaryKey = "cli_pk_id";
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'cli_razon_social',
        'cli_rep_legal',
        'cli_email',
        'cli_direccion',
        'dep_fk_id',
        'mun_fk_id',
        'cli_fecha_inicio',
        'cli_fecha_fin',
        'cli_numero_sedes'
    ];
}