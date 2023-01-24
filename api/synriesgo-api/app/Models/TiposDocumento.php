<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TiposDocumento extends Model
{
    protected $table = 'tipos_documento';
    protected $primaryKey = "tdo_pk_id";
    public $timestamps = false;
    public $incrementing = false;
}
