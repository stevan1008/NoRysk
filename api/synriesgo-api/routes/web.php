<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

use App\Http\Controllers\Auth\UserVerificationEmail;
use App\Http\Controllers\Auth\UserPasswordReset;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('http://127.0.0.1:4200');
});

Route::get('/userVerifyEmail/{code}', [UserVerificationEmail::class, 'verifyUserEmail']);
Route::get('/passwordReset/{code}', [UserPasswordReset::class, 'mostrarInterfazRecuperacionInicial'])->name('password.form');
Route::get('/passwordReset/{code}/{status}', [UserPasswordReset::class, 'mostrarInterfazRecuperacion'])->name('password.form2');
Route::put('/passwordReset/{email}/{code}', [UserPasswordReset::class, 'reestablecerContrasena'])->name('password.change');