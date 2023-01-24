<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\ClientesController;
use App\Http\Controllers\API\UsuariosController;
use App\Http\Controllers\API\PlaneacionEstrategicaController;
use App\Http\Controllers\API\MapaProcesosController;
use App\Http\Controllers\API\GestionRiesgoController; 
use App\Http\Controllers\API\ControlRiesgoController;

Route::group(['middleware' => ['auth:api', 'cors', 'scopes:api', 'checkAdmin'], 'prefix' => 'usuarios'], function() {
    Route::get('/verificarTokenAccesoAdministrador/{jwt}', [UsuariosController::class, 'verificarTokenAccesoAdminsitrador']);
});

Route::group(['middleware' => ['auth:api', 'cors', 'scopes:api'], 'prefix' => 'usuarios'], function() {
    Route::get('/verificarTokenAccesoUsuario/{jwt}', [UsuariosController::class, 'verificarTokenAccesoUsuario']);
});

Route::group(['middleware' => ['auth:api', 'cors', 'scopes:api'], 'prefix' => 'usuarios'], function() {
    Route::post('/verificarAccesoUsuario', [UsuariosController::class, 'verificarAccesoUsuario']);
    Route::delete('/revocarTokenAccesoUsuario', [UsuariosController::class, 'revocarTokenAcceso']);
    Route::delete('/borrarTokenAccesoEspecifico/{id}', [UsuariosController::class, 'borrarTokenAccesoEspecifico']);
    Route::put('/reenviarVerificacionCorreo/{id}', [UsuariosController::class, 'reenviarVerificacionCorreo']);
    Route::post('/verificarExistenciaCorreoElectronico', [UsuariosController::class, 'verificarExistenciaCorreoElectronico']);
});

Route::group(['middleware' => ['auth:api', 'cors', 'scopes:api', 'checkAdmin'], 'prefix' => 'administrador/clientes'], function() {
    Route::get('/obtenerClientes', [ClientesController::class, 'obtenerClientes']);
    Route::get('/obtenerClientesActivos', [ClientesController::class, 'obtenerClientesActivos']);
    Route::post('/crearCliente', [ClientesController::class, 'crearCliente']);
    Route::put('/actualizarCliente/{id}', [ClientesController::class, 'actualizarCliente']);
});

Route::group(['middleware' => ['auth:api', 'cors', 'scopes:api'], 'prefix' => 'clientes'], function() {
    Route::get('/verificarExistenciaIdentificador/{identificador}', [ClientesController::class, 'verificarExistenciaIdentificador']);
});

Route::group(['middleware' => ['auth:api', 'cors', 'scopes:api'], 'prefix' => 'usuarios'], function() {
    Route::post('/registrarUsuario', [UsuariosController::class, 'registrarUsuario']);
});

Route::group(['middleware' => ['auth:api', 'cors', 'scopes:api', 'checkAdmin'], 'prefix' => 'administrador/usuarios'], function() {
    Route::get('/obtenerUsuarioResponsableEntidad/{cliente}', [UsuariosController::class, 'obtenerUsuarioResponsableEntidad']);
    Route::put('/actualizarUsuario/{id}', [UsuariosController::class, 'actualizarUsuarioAdministrador']);
});

Route::group(['middleware' => ['auth:api', 'cors', 'scopes:api', 'checkAdminResponsable'], 'prefix' => 'usuarios'], function() {
    Route::delete('/inhabilitarUsuario/{id}', [UsuariosController::class, 'inhabilitarUsuario']);
});

Route::group(['middleware' => ['cors', 'scopes:password-reset'], 'prefix' => 'usuarios'], function() {
    Route::put('/enviarRecuperacionContrasena/{email}', [UsuariosController::class, 'enviarRecuperacionContrasena']);
});

Route::group(['middleware' => ['auth:api', 'cors', 'scopes:api', 'checkResponsable'], 'prefix' => 'parametros'], function() {
    Route::get('/planeacionEstrategica/obtenerMisionVision', [PlaneacionEstrategicaController::class, 'obtenerMisionVision']);
    Route::get('/planeacionEstrategica/obtenerObjetivos', [PlaneacionEstrategicaController::class, 'obtenerObjetivos']);
    Route::post('/planeacionEstrategica/crearPlaneacionEstrategica', [PlaneacionEstrategicaController::class, 'crearPlaneacionEstrategica']);
    Route::put('/planeacionEstrategica/actualizarPlaneacionEstrategica/{id}', [PlaneacionEstrategicaController::class, 'actualizarPlaneacionEstrategica']);

    Route::get('/planeacionEstrategica/obtenerProcesos', [MapaProcesosController::class, 'obtenerProcesos']);
    Route::get('/planeacionEstrategica/obtenerSubprocesos/{idProceso}', [MapaProcesosController::class, 'obtenerSubprocesos']);
    Route::post('/planeacionEstrategica/crearProceso', [MapaProcesosController::class, 'crearProceso']);
    Route::post('/planeacionEstrategica/crearSubproceso', [MapaProcesosController::class, 'crearSubproceso']);
    Route::put('/planeacionEstrategica/actualizarProceso/{id}', [MapaProcesosController::class, 'actualizarProceso']);
    Route::put('/planeacionEstrategica/actualizarSubproceso/{id}', [MapaProcesosController::class, 'actualizarSubproceso']);
    Route::post('/planeacionEstrategica/persistenciaMasivaProcesos', [MapaProcesosController::class, 'persistenciaMasivaProcesos']);
    Route::post('/planeacionEstrategica/persistenciaMasivaSubprocesos', [MapaProcesosController::class, 'persistenciaMasivaSubprocesos']);
    Route::delete('/planeacionEstrategica/borrarProceso/{idProceso}', [MapaProcesosController::class, 'borrarProceso']);
    Route::delete('/planeacionEstrategica/borrarSubproceso/{idSubproceso}/{idProceso}', [MapaProcesosController::class, 'borrarSubproceso']);
});

Route::group(['middleware' => ['auth:api', 'cors', 'scopes:api'], 'prefix' => 'gestion'], function() {
    Route::get('/gestionRiesgo/obtenerGestionRiesgo', [GestionRiesgoController::class, 'obtenerGestionRiesgo']);
    Route::post('/gestionRiesgo/crearGestionRiesgo', [GestionRiesgoController::class, 'crearGestionRiesgo']);
    Route::put('/gestionRiesgo/actualizarGestionRiesgo/{id}', [GestionRiesgoController::class, 'actualizarGestionRiesgo']);
});

Route::group(['middleware' => ['cors'], 'prefix' => 'control'], function() {
    Route::get('/controlRiesgo/obtenerControlRiesgo', [ControlRiesgoController::class, 'obtenerControlRiesgo']);
    Route::post('/controlRiesgo/crearControlRiesgo', [ControlRiesgoController::class, 'crearControlRiesgo']);
    Route::put('/controlRiesgo/actualizarControlRiesgo/{id}', [ControlRiesgoController::class, 'actualizarControlRiesgo']);
});
