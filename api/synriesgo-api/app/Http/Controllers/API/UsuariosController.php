<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\PasswordResets;
use App\Models\OAuthAccessTokens;

use App\Http\Controllers\Auth\MailController;

class UsuariosController extends Controller
{
    public function verificarAccesoUsuario(Request $request) {
        $user = User::where('email', $request->input('email'))
                    ->where('id', '>=', 2)
                    ->where('usu_activo', true);

        if ($user->count() == 0 || $user->value('email_verified_at') == null) {
            return response(['valid' => false], 200);
        }

        $this->borrarTokensAccesoVencidos($request);

        return response(
            [
                'valid' => true,
                'user' => $user->get()->toArray()[0]
            ]
        , 200);
    }

    public function verificarTokenAccesoAdminsitrador(Request $request, $jwt) {
        $tokens = (array) json_decode(json_encode(Auth::user()->tokens));

        usort($tokens, function($a, $b) {
            return date($a->created_at) < date($b->created_at);
        });

        if (strval($tokens[0]->id) !== strval($jwt)) {
            return response(401);
        }

        return response(200);
    }

    public function verificarTokenAccesoUsuario(Request $request, $jwt) {
        $tokens = (array) json_decode(json_encode(Auth::user()->tokens));

        usort($tokens, function($a, $b) {
            return date($a->created_at) < date($b->created_at);
        });

        // AGREGAR CONDICIONES DEL CONTRATO

        if (strval($tokens[0]->id) !== strval($jwt)) {
            return response(401);
        }

        return response(200);
    }

    public function verificarTokenAccesoCliente(Request $request, $jwt) {
        return response(200);
    }

    private function borrarTokensAccesoVencidos(Request $request) {
        $tokens = (array) json_decode(json_encode(Auth::user()->tokens));

        usort($tokens, function($a, $b) {
            return date($a->created_at) < date($b->created_at);
        });

        if (count($tokens) > 1) {
            for ($i = 1; $i < count($tokens); $i++) {
                if (in_array("api", $tokens[$i]->scopes)) {
                    OAuthAccessTokens::where('id', $tokens[$i]->id)->delete();
                }
            }
        }

        return response(['Tokens purgados'], 200);
    }

    public function revocarTokenAcceso(Request $request) {
        $tokens = Auth::user()->tokens;

        foreach ($tokens as $tKey => $token) {
            $token->delete();
        }

        return response(['Tokens de acceso revocados'], 200);
    }

    public function obtenerUsuarioResponsableEntidad(Request $request, $cliente) {
        return User::where('cli_fk_id', $cliente)
                   ->where('rol_fk_id', 2)
                   ->where('usu_activo', true)
                   ->get()->toArray();
    }

    public function registrarUsuario(Request $request) {
        $user = null;
        $accessToken = null;

        \DB::transaction(function() use ($request, &$user, &$accessToken) {
            $datosValidados = $request->validate(
                [
                    'cli_fk_id' => 'required',
                    'name' => 'required|max:255',
                    'email' => 'required|email|unique:users',
                    'password' => 'required|confirmed|min:8|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!$#%@*+-]).*$/',
                    'rol_fk_id' => 'required',
                    'tdo_fk_id' => 'required',
                    'usu_documento' => 'required'
                ]
            );

            if (!$request->administrador && intval($request->rol_fk_id) == 1) {
                abort(409, 'No authorizado');
            }

            $datosValidados['password'] = Hash::make($request->password);

            // Enviar correo para verificar
            $datosValidados['email_verif_code'] = Str::random(70);

            // El usuario tiene 2 dias para verificar su correo
            $codeLife = new \DateTime();
            $codeLife->modify('+2 day');
            $datosValidados['email_verif_code_life'] = strval($codeLife->format('Y-m-d H:i:s'));

            // Crear el usuario
            $user = User::create($datosValidados);

            (new MailController)->sendVerificationEmail($datosValidados['email'],
                                                        $datosValidados['email_verif_code'],
                                                        $datosValidados['email_verif_code_life']);
        });

        return response(
            [
                'user' => $user,
                'access_token' => $accessToken
            ]
        );
    }

    public function actualizarUsuarioAdministrador(Request $request, $id) {
        \DB::transaction(function() use ($request, $id) {
            // El usuario tiene 2 dias para verificar su correo
            $codeLife = new \DateTime();
            $codeLife->modify('+2 day');

            // Borrar los tokens de acceso
            OAuthAccessTokens::where('user_id', $id)->delete();

            $verifCode = Str::random(70);
            $verifCodeLife = $codeLife->format('Y-m-d H:i:s');

            User::where('id', $id)->update(
                [
                    'name' => $request->input('name'),
                    'tdo_fk_id' => $request->input('tdo_fk_id'),
                    'usu_documento' => $request->input('usu_documento'),
                    'password' => Hash::make($request->password),
                    'email_verif_code' => $verifCode,
                    'email_verif_code_life' => strval($verifCodeLife),
                    'email_verified_at' => null
                ]
            );

            (new MailController)->sendVerificationEmail($request->email,
                                                        $verifCode,
                                                        $verifCodeLife);
        });

        return response(200);
    }

    public function inhabilitarUsuario(Request $request, $id) {
        \DB::transaction(function() use ($request, $id) {
            OAuthAccessTokens::where('user_id', $id)->delete();

            $usuario = User::where('id', $id);

            User::where('id', $id)->update(
                [
                    'email' => $usuario->value('email').'.deleted_'.date("Y-m-d H:i:s"),
                    'usu_activo' => false
                ]
            );
        });

        return response(200);
    }

    public function reenviarVerificacionCorreo(Request $request, $id) {
        $user = User::where('id', $id);

        $email = $user->value('email');

        // El usuario tiene 1 dia para verificar su correo
        $codeLife = new \DateTime();
        $codeLife->modify('+1 day');

        $code = Str::random(70);

        $user->update(
            [
                'email_verif_code' => $code,
                'email_verif_code_life' => strval($codeLife->format('Y-m-d H:i:s')),
                'email_verified_at' => null
            ]
        );

        (new MailController)->sendVerificationEmail($email,
                                                    $code,
                                                    strval($codeLife->format('Y-m-d H:i:s')));
    }

    public function enviarRecuperacionContrasena(Request $request, $email) {
        \DB::transaction(function() use($request, $email) {
            if (User::where('email', $email)->where('usu_activo', true)->whereNotNull('email_verified_at')->count()) {
                $code = Str::random(70);
                $codeLife = null;

                PasswordResets::where('email', $email)->delete();

                PasswordResets::create(
                    [
                        'email' => $email,
                        'token' => $code,
                        'created_at' => now()
                    ]
                );

                // El usuario tiene 2 dias para restaurar su contraseña
                $codeLife = new \DateTime();
                $codeLife->modify('+2 day');

                (new MailController)->sendPasswordReset($email,
                                                        $code,
                                                        strval($codeLife->format('Y-m-d H:i:s')));
            }
        });

        return response(['Correo de recuperación de contraseña enviado'], 200);
    }

    public function borrarTokenAccesoEspecifico(Request $request, $id) {
        OAuthAccessTokens::where('id', $id)->delete();

        return response(['Token borrado exitosamente'], 200);
    }

    public function verificarExistenciaCorreoElectronico(Request $request) {
        return User::where('email', $request->input('email'))->count();
    }
}

