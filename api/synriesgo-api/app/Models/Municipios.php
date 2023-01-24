<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Municipios extends Model
{
    protected $table = 'municipios';
    protected $primaryKey = "mun_pk_id";
    public $timestamps = false;
    public $incrementing = false;
}
