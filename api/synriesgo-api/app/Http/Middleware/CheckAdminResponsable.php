<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class CheckAdminResponsable
{
    public function handle($request, Closure $next)
    {
        if (intval(Auth::user()->rol_fk_id) != 1 && intval(Auth::user()->rol_fk_id) != 2) {
            throw new \Exception('Imposible completar la petición.');
        }

        return $next($request);
    }
}