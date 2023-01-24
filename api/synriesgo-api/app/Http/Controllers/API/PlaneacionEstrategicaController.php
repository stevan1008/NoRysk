<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Services\DBClientConnection;

use App\Models\PlaneacionEstrategica;
use App\Models\PlaneacionEstrategicaObjetivos;

class PlaneacionEstrategicaController extends Controller
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

    public function obtenerMisionVision(Request $request) {
        return PlaneacionEstrategica::on($this->cliente)->get()->toArray();
    }

    public function obtenerObjetivos(Request $request) {
        return PlaneacionEstrategicaObjetivos::on($this->cliente)->where('peo_borrado', false)->get()->toArray();
    }

    public function crearPlaneacionEstrategica(Request $request) {
        $id = null;
        $objetivos = $request->input('objetivos');

        $cliente = $this->cliente;

        \DB::connection($cliente)->transaction(function() use($request, &$id, &$objetivos, $cliente) {
            $id = PlaneacionEstrategica::on($cliente)->create([
                'pes_mision' => $request->input('pes_mision'),
                'pes_vision' => $request->input('pes_vision')
            ])->pes_pk_id;

            $indice = 0;

            foreach($request->input('objetivos') as $obj) {
                $id = PlaneacionEstrategicaObjetivos::on($cliente)->create(['peo_objetivo' => $obj['peo_objetivo']])->peo_pk_id;
                $objetivos[$indice++]['peo_pk_id'] = $id;
            }
        });

        return [$id, $objetivos];
    }

    public function actualizarPlaneacionEstrategica(Request $request, $id) {
        $objetivos = $request->input('objetivos');
        $cliente = $this->cliente;

        \DB::connection($cliente)->transaction(function() use($request, $id, &$objetivos, $cliente) {
            PlaneacionEstrategica::on($cliente)->where('pes_pk_id', $id)->update([
                'pes_mision' => $request->input('pes_mision'),
                'pes_vision' => $request->input('pes_vision')
            ]);

            $indice = 0;

            foreach($objetivos as $obj) {
                if ($obj['peo_pk_id'] === null) {
                    $id = PlaneacionEstrategicaObjetivos::on($cliente)->create(['peo_objetivo' => $obj['peo_objetivo']])->peo_pk_id;
                    $objetivos[$indice]['peo_pk_id'] = $id;
                } else if ($obj['peo_actualizado'] === true) {
                    PlaneacionEstrategicaObjetivos::on($cliente)->where('peo_pk_id', $obj['peo_pk_id'])->update(['peo_objetivo' => $obj['peo_objetivo']]);
                    $objetivos[$indice]['peo_actualizado'] = false;
                } else if ($obj['peo_borrado'] === true) {
                    PlaneacionEstrategicaObjetivos::on($cliente)->where('peo_pk_id', $obj['peo_pk_id'])
                    ->update(['peo_borrado' => true]);
                }

                $indice++;
            }
        });

        return $objetivos;
    }
}
