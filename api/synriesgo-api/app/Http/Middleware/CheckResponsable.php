<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class CheckResponsable
{
    public function handle($request, Closure $next)
    {
        if (intval(Auth::user()->rol_fk_id) != 2) {
            throw new \Exception('Imposible completar la petición.');
        }

        return $next($request);
    }
}