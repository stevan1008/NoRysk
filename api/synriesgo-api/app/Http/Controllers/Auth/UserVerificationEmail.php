<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;

class UserVerificationEmail extends Controller
{
    public function verifyUserEmail(Request $request, $code) {
        $user = User::selectRaw("extract(DAY FROM age(timestamp 'now()', date(email_verif_code_life))) as time")
                    ->where('email_verif_code', $code)
                    ->where('usu_activo', true);

        if ($user->count() && intval($user->value('time')) <= 0) {
            // Añadir la vida del token
            $user->update(
                [
                    'email_verif_code' => null,
                    'email_verif_code_life' => null,
                    'email_verified_at' => strval(now())
                ]
            );

            return view('emailVerified', ['url' => env('CLI_URL')]);
        } else {
            return view('emailNotVerified');
        }
    }
}
