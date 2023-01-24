<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Departamentos extends Model
{
    protected $table = 'departamentos';
    protected $primaryKey = "dep_pk_id";
    public $timestamps = false;
    public $incrementing = false;
}
