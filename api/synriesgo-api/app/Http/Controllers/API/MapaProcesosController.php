<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Services\DBClientConnection;

use App\Models\Procesos;
use App\Models\Subprocesos;

class MapaProcesosController extends Controller
{
    private $cliente;

    function __construct() {
        // Crear la conexion temporal al esquema del cliente
        if (\Auth::user() !== null) {
            $this->cliente = \Auth::user()->cli_fk_id;
            $connection = new DBClientConnection($this->cliente);
            config(['database.connections.'.$this->cliente => $connection->getConnectionArray()]);
        }
    }

    public function obtenerProcesos(Request $request) {
        return Procesos::on($this->cliente)->where('prc_borrado', false)->orderBy('prc_pk_id')->get()->toArray();
    }

    public function obtenerSubprocesos(Request $request, $idProceso) {
        return Subprocesos::on($this->cliente)->where('prc_fk_id', $idProceso)->where('spr_borrado', false)->orderBy('spr_pk_id')->get()->toArray();
    }

    public function crearProceso(Request $request) {
        $id = Procesos::on($this->cliente)->create([
            'mpc_fk_id' => $request->input('mpc_fk_id'),
            'prc_nombre' => $request->input('prc_nombre')
        ])->prc_pk_id;

        return $id;
    }

    public function crearSubproceso(Request $request) {
        $cliente = $this->cliente;
        $id = null;

        \DB::connection($cliente)->transaction(function() use($request, &$id) {
            $id = Subprocesos::on($this->cliente)->create([
                'mpc_fk_id' => $request->input('mpc_fk_id'),
                'prc_fk_id' => $request->input('prc_fk_id'),
                'spr_nombre' => $request->input('spr_nombre')
            ])->spr_pk_id;

            $conteoSubprocesos = Subprocesos::on($this->cliente)
                                            ->where('prc_fk_id', $request->input('prc_fk_id'))
                                            ->where('spr_borrado', false)
                                            ->count();

            if ($conteoSubprocesos > 0) {
                Procesos::on($this->cliente)->where('prc_pk_id', $request->input('prc_fk_id'))
                ->update(['prc_asignado' => true]);
            }
        });

        return $id;
    }

    public function actualizarProceso(Request $request, $id) {
        Procesos::on($this->cliente)->where('prc_pk_id', $id)->update(['prc_nombre' => $request->input('prc_nombre')]);

        return response(200);
    }

    public function actualizarSubproceso(Request $request, $id) {
        Subprocesos::on($this->cliente)->where('spr_pk_id', $id)->update(['spr_nombre' => $request->input('spr_nombre')]);

        return response(200);
    }

    public function persistenciaMasivaProcesos(Request $request) {
        $estrategicos = $request->input('estrategicos');
        $misionales = $request->input('misionales');
        $apoyo = $request->input('apoyo');
        $evaluacion = $request->input('evaluacion');

        $cliente = $this->cliente;

        \DB::connection($cliente)->transaction(function() use($request, &$estrategicos, &$misionales, &$apoyo, &$evaluacion, $cliente) {
            // Estratégicos
            $indice = 0;

            foreach($estrategicos as $prc) {
                if ($prc['prc_pk_id'] === null) {
                    $id = Procesos::on($cliente)->create(['mpc_fk_id' => 1, 'prc_nombre' => $prc['prc_nombre']])->prc_pk_id;
                    $estrategicos[$indice]['prc_pk_id'] = $id;
                } else if ($prc['prc_actualizado'] === true) {
                    Procesos::on($cliente)->where('prc_pk_id', $prc['prc_pk_id'])->update(['prc_nombre' => $prc['prc_nombre']]);
                    $estrategicos[$indice]['prc_actualizado'] = false;
                }

                $indice++;
            }

            // Misionales
            $indice = 0;

            foreach($misionales as $prc) {
                if ($prc['prc_pk_id'] === null) {
                    $id = Procesos::on($cliente)->create(['mpc_fk_id' => 2, 'prc_nombre' => $prc['prc_nombre']])->prc_pk_id;
                    $misionales[$indice]['prc_pk_id'] = $id;
                } else if ($prc['prc_actualizado'] === true) {
                    Procesos::on($cliente)->where('prc_pk_id', $prc['prc_pk_id'])->update(['prc_nombre' => $prc['prc_nombre']]);
                    $misionales[$indice]['prc_actualizado'] = false;
                }

                $indice++;
            }

            // Apoyo
            $indice = 0;

            foreach($apoyo as $prc) {
                if ($prc['prc_pk_id'] === null) {
                    $id = Procesos::on($cliente)->create(['mpc_fk_id' => 3, 'prc_nombre' => $prc['prc_nombre']])->prc_pk_id;
                    $apoyo[$indice]['prc_pk_id'] = $id;
                } else if ($prc['prc_actualizado'] === true) {
                    Procesos::on($cliente)->where('prc_pk_id', $prc['prc_pk_id'])->update(['prc_nombre' => $prc['prc_nombre']]);
                    $apoyo[$indice]['prc_actualizado'] = false;
                }

                $indice++;
            }

            // Evaluación
            $indice = 0;

            foreach($evaluacion as $prc) {
                if ($prc['prc_pk_id'] === null) {
                    $id = Procesos::on($cliente)->create(['mpc_fk_id' => 4, 'prc_nombre' => $prc['prc_nombre']])->prc_pk_id;
                    $evaluacion[$indice]['prc_pk_id'] = $id;
                } else if ($prc['prc_actualizado'] === true) {
                    Procesos::on($cliente)->where('prc_pk_id', $prc['prc_pk_id'])->update(['prc_nombre' => $prc['prc_nombre']]);
                    $evaluacion[$indice]['prc_actualizado'] = false;
                }

                $indice++;
            }
        });

        return [$estrategicos, $misionales, $apoyo, $evaluacion];
    }

    public function persistenciaMasivaSubprocesos(Request $request) {
        $macroproceso = $request->input('mpc_fk_id');
        $proceso = $request->input('prc_fk_id');
        $subprocesos = $request->input('subprocesos');

        $cliente = $this->cliente;

        \DB::connection($cliente)->transaction(function() use($request, $macroproceso, $proceso, &$subprocesos, $cliente) {
            $indice = 0;

            foreach($subprocesos as $spr) {
                if ($spr['spr_pk_id'] === null) {
                    $id = Subprocesos::on($cliente)->create(
                        ['mpc_fk_id' => $macroproceso, 'prc_fk_id' => $proceso, 'spr_nombre' => $spr['spr_nombre']]
                    )->spr_pk_id;

                    $subprocesos[$indice]['spr_pk_id'] = $id;
                } else if ($spr['spr_actualizado'] === true) {
                    Subprocesos::on($cliente)->where('spr_pk_id', $spr['spr_pk_id'])->update(['spr_nombre' => $spr['spr_nombre']]);
                    $subprocesos[$indice]['spr_actualizado'] = false;
                }

                $indice++;
            }
        });

        return $subprocesos;
    }

    public function borrarProceso(Request $request, $idProceso) {
        $cliente = $this->cliente;

        \DB::connection($cliente)->transaction(function() use($request, $idProceso, $cliente) {
            Procesos::on($this->cliente)->where('prc_pk_id', $idProceso)->update(['prc_borrado' => true]);
            Subprocesos::on($this->cliente)->where('prc_fk_id', $idProceso)->update(['spr_borrado' => true]);
        });

        return response(200);
    }

    public function borrarSubproceso(Request $request, $idSubproceso, $idProceso) {
        Subprocesos::on($this->cliente)->where('spr_pk_id', $idSubproceso)->update(['spr_borrado' => true]);

        $conteoSubprocesos = Subprocesos::on($this->cliente)
                                        ->where('prc_fk_id', $request->input('prc_fk_id'))
                                        ->where('spr_borrado', false)
                                        ->count();

        if ($conteoSubprocesos == 0) {
            Procesos::on($this->cliente)->where('prc_pk_id', $request->input('prc_fk_id'))
            ->update(['prc_asignado' => false]);
        }

        return response(200);
    }
}
