<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Services\DBClientConnection;

use App\Models\GestionRiesgo;

class GestionRiesgoController extends Controller
{
    private $cliente;

    function __construct() {
        if (\Auth::user() !== null) {

            $this->cliente = \Auth::user()->cli_fk_id;

            $connection = new DBClientConnection($this->cliente);

            config(['database.connections.'.$this->cliente => $connection->getConnectionArray()]);

        }
    }

    public function obtenerGestionRiesgo(Request $request) {
        return GestionRiesgo::on($this->cliente)->orderBy('ger_pk_id')->get()->toArray();
    }

    public function crearGestionRiesgo(Request $request) {
        error_log($request);
        $id = GestionRiesgo::on($this->cliente)->create([
            'sed_fk_id' => $request->input('sed_fk_id'),
            'prc_fk_id' => $request->input('prc_fk_id'),
            'spr_fk_id' => $request->input('spr_fk_id'),
            'cgr_fk_id' => $request->input('cgr_fk_id'),
            'clr_fk_id' => $request->input('clr_fk_id'),
            'tpr_fk_id' => $request->input('tpr_fk_id'),
            'ger_fallo_riesgo_1' => $request->input('ger_fallo_riesgo_1'),
            'ger_fallo_riesgo_2' => $request->input('ger_fallo_riesgo_2'),
            'ger_fallo_riesgo_3' => $request->input('ger_fallo_riesgo_3'),
            'ger_fallo_riesgo_4' => $request->input('ger_fallo_riesgo_4'),
            'ger_fallo_riesgo_5' => $request->input('ger_fallo_riesgo_5'),
            'ger_fallo_riesgo_6' => $request->input('ger_fallo_riesgo_6'),
            'ger_fallo_riesgo_7' => $request->input('ger_fallo_riesgo_7'),
            'ger_fallo_riesgo_8' => $request->input('ger_fallo_riesgo_8'),
            'ger_fallo_riesgo_9' => $request->input('ger_fallo_riesgo_9'),
            'ger_fallo_riesgo_10' => $request->input('ger_fallo_riesgo_10'),
            'ger_fallo_riesgo_11' => $request->input('ger_fallo_riesgo_11'),
            'ger_fallo_riesgo_12' => $request->input('ger_fallo_riesgo_12'),
            'ger_fallo_riesgo_13' => $request->input('ger_fallo_riesgo_13'),
            'ger_fallo_riesgo_14' => $request->input('ger_fallo_riesgo_14'),
            'ger_fallo_riesgo_15' => $request->input('ger_fallo_riesgo_15'),
            'ger_fallo_riesgo_16' => $request->input('ger_fallo_riesgo_16'),
            'ger_fallo_riesgo_17' => $request->input('ger_fallo_riesgo_17'),
            'ger_fallo_riesgo_18' => $request->input('ger_fallo_riesgo_18'),
            'ger_fallo_riesgo_19' => $request->input('ger_fallo_riesgo_19'),
            'ger_fallo_riesgo_20' => $request->input('ger_fallo_riesgo_20'),
            'ger_fallo_riesgo_21' => $request->input('ger_fallo_riesgo_21'),
            'ger_fallo_riesgo_22' => $request->input('ger_fallo_riesgo_22'),
            'ger_fallo_riesgo_23' => $request->input('ger_fallo_riesgo_23'),
            'ger_fallo_riesgo_24' => $request->input('ger_fallo_riesgo_24'),
            'far_fk_id' => $request->input('far_fk_id'),
            'ger_desc_materializacion' => $request->input('ger_desc_materializacion'),
            'ger_activo_afectado' => $request->input('ger_activo_afectado'),
            'ger_pilares_afectados_1' => $request->input('ger_pilares_afectados_1'),
            'ger_pilares_afectados_2' => $request->input('ger_pilares_afectados_2'),
            'ger_pilares_afectados_3' => $request->input('ger_pilares_afectados_3'),
            'prb_fk_id' => $request->input('prb_fk_id'),
            'imp_fk_id' => $request->input('imp_fk_id'),
            'ger_borrado' => $request->input('ger_borrado'),
        ])->ger_pk_id;

        return $id;
    }

    public function actualizarGestionRiesgo(Request $request, $id) {
        GestionRiesgo::on($this->cliente)->where('ger_pk_id', $id)->update([
            'prc_fk_id' => $request->input('prc_fk_id'),
            'spr_fk_id' => $request->input('spr_fk_id'),
            'cgr_pk_id' => $request->input('cgr_pk_id'),
            'clr_pk_id' => $request->input('clr_pk_id'),
            'ger_fallo_riesgo_1' => $request->input('ger_fallo_riesgo_1'),
            'ger_fallo_riesgo_2' => $request->input('ger_fallo_riesgo_2'),
            'ger_fallo_riesgo_3' => $request->input('ger_fallo_riesgo_3'),
            'ger_fallo_riesgo_4' => $request->input('ger_fallo_riesgo_4'),
            'ger_fallo_riesgo_5' => $request->input('ger_fallo_riesgo_5'),
            'ger_fallo_riesgo_6' => $request->input('ger_fallo_riesgo_6'),
            'ger_fallo_riesgo_7' => $request->input('ger_fallo_riesgo_7'),
            'ger_fallo_riesgo_8' => $request->input('ger_fallo_riesgo_8'),
            'ger_fallo_riesgo_9' => $request->input('ger_fallo_riesgo_9'),
            'ger_fallo_riesgo_10' => $request->input('ger_fallo_riesgo_10'),
            'ger_fallo_riesgo_11' => $request->input('ger_fallo_riesgo_11'),
            'ger_fallo_riesgo_12' => $request->input('ger_fallo_riesgo_12'),
            'ger_fallo_riesgo_13' => $request->input('ger_fallo_riesgo_13'),
            'ger_fallo_riesgo_14' => $request->input('ger_fallo_riesgo_14'),
            'ger_fallo_riesgo_15' => $request->input('ger_fallo_riesgo_15'),
            'ger_fallo_riesgo_16' => $request->input('ger_fallo_riesgo_16'),
            'ger_fallo_riesgo_17' => $request->input('ger_fallo_riesgo_17'),
            'ger_fallo_riesgo_18' => $request->input('ger_fallo_riesgo_18'),
            'ger_fallo_riesgo_19' => $request->input('ger_fallo_riesgo_19'),
            'ger_fallo_riesgo_20' => $request->input('ger_fallo_riesgo_20'),
            'ger_fallo_riesgo_21' => $request->input('ger_fallo_riesgo_21'),
            'ger_fallo_riesgo_22' => $request->input('ger_fallo_riesgo_22'),
            'ger_fallo_riesgo_23' => $request->input('ger_fallo_riesgo_23'),
            'ger_fallo_riesgo_24' => $request->input('ger_fallo_riesgo_24'),
            'far_fk_id' => $request->input('far_fk_id'),
            'ger_desc_materializacioni' => $request->input('ger_desc_materializacioni'),
            'ger_activo_afectado' => $request->input('ger_activo_afectado'),
            'ger_pilares_afectados_1' => $request->input('ger_pilares_afectados_1'),
            'ger_pilares_afectados_2' => $request->input('ger_pilares_afectados_2'),
            'ger_pilares_afectados_3' => $request->input('ger_pilares_afectados_3'),
            'prb_fk_id' => $request->input('prb_fk_id'),
            'imp_fk_id' => $request->input('imp_fk_id'),
            'ger_borrado' => $request->input('ger_borrado'),
        ]);

        return response(200);
    }
}
