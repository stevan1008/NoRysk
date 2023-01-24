<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Macroprocesos extends Model
{
    protected $table = 'macroprocesos';
    protected $primaryKey = "mpc_pk_id";
    public $timestamps = true;
    public $incrementing = true;

    protected $fillable = [
        'mpc_descripcion'
    ];
}