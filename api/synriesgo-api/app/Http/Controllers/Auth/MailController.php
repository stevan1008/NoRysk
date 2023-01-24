<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

use App\Mail\UserEmailVerify;
use App\Mail\PasswordReset;

class MailController extends Controller
{
    public function sendVerificationEmail($email, $key, $life)
    {
        $route = env('APP_URL').'/userVerifyEmail';
        Mail::to($email)->send(new UserEmailVerify($route, $key, $life));
    }

    public function sendPasswordReset($email, $key, $life)
    {
        $route = env('APP_URL').'/passwordReset';
        Mail::to($email)->send(new PasswordReset($route, $key, $life));
    }
}
