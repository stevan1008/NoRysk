<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subprocesos extends Model
{
    protected $table = 'subprocesos';
    protected $primaryKey = "spr_pk_id";
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'prc_fk_id',
        'spr_nombre',
        'spr_borrado'
    ];
}