<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use App\Models\PasswordResets;

class UserPasswordReset extends Controller
{
    public function mostrarInterfazRecuperacionInicial(Request $request, $code) {
        $pass = PasswordResets::selectRaw("email, extract(DAY FROM age(timestamp 'now()', date(created_at))) as time")
                              ->where('token', $code);

        if ($pass->count() && intval($pass->value('time')) <= 0) {
            return view('passwordReset', [
                'email' => $pass->value('email'),
                'code' => $code,
                'status' => 1
            ]);
        }

        return view('passwordResetError');
    }

    public function mostrarInterfazRecuperacion(Request $request, $code, $status) {
        $pass = PasswordResets::selectRaw("email, extract(DAY FROM age(timestamp 'now()', date(created_at))) as time")
                              ->where('token', $code);

        if ($pass->count() && intval($pass->value('time')) <= 0) {
            return view('passwordReset', [
                'email' => $pass->value('email'),
                'code' => $code,
                'status' => $status
            ]);
        }

        return view('passwordResetError');
    }

    public function reestablecerContrasena(Request $request, $email, $code) {
        $pass = PasswordResets::selectRaw("email, extract(DAY FROM age(timestamp 'now()', date(created_at))) as time")
                              ->where('token', $code);

        if ($pass->count() && intval($pass->value('time')) <= 0) {
            $password = trim($request->input('pass'));
            $password_conf = trim($request->input('pass_conf'));

            $pattern = "/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!$#%@*+-]).*$/";

            if ($password != $password_conf) {
                return redirect('passwordReset/'.$code.'/0');
            } if (intval(preg_match($pattern, $password)) == 0) {
                return redirect('passwordReset/'.$code.'/2');
            } else {
                \DB::transaction(function() use($password, $email) {
                    User::where('email', $email)
                    ->update(
                        [
                            'password' => Hash::make($password)
                        ]
                    );

                    PasswordResets::where('email', $email)->delete();
                });

                return view('passwordResetConf');
            }
        }

        return view('passwordResetError');
    }
}
