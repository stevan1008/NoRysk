<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Services\DBClientConnection;

use App\Models\ControlRiesgo;

class ControlRiesgoController extends Controller
{
    private $cliente;

    function __construct() {
        if (\Auth::user() !== null) {

            $this->cliente = \Auth::user()->cli_fk_id;

            $connection = new DBClientConnection($this->cliente);

            config(['database.connections.'.$this->cliente => $connection->getConnectionArray()]);

        }
    }

    public function obtenerControlRiesgo(Request $request) {
        return ControlRiesgo::on($this->cliente)->orderBy('ger_pk_id')->get()->toArray();
    }

    public function crearControlRiesgo(Request $request) {
        error_log($request);
        $id = ControlRiesgo::on($this->cliente)->create([
            'ger_fk_id' => $request->input('ger_fk_id'),
            'cri_desc' => $request->input('cri_desc'),
            'cgr_fk_id' => $request->input('cgr_fk_id'),
            'cri_responsable' => $request->input('cri_responsable'),
            'tdc_fk_id' => $request->input('tdc_fk_id'),
            'nac_fk_id' => $request->input('nac_fk_id'),
            'pec_fk_id' => $request->input('pec_fk_id'),
            'cri_ref_control' => $request->input('cri_ref_control'),
            'cri_mitiga_1' => $request->input('cri_mitiga_1'),
            'cri_mitiga_2' => $request->input('cri_mitiga_3'),
            'cri_seg_cont_1' => $request->input('cri_seg_cont_1'),
            'cri_seg_cont_2' => $request->input('cri_seg_cont_2'),
            'cri_seg_cont_3' => $request->input('cri_seg_cont_3'),
            'cri_apl_control_1' => $request->input('cri_apl_control_1'),
            'cri_apl_control_2' => $request->input('cri_apl_control_2'),
            'cri_apl_control_otro' => $request->input('cri_apl_control_otro'),
            'dic_fk_id' => $request->input('dic_fk_id'),
            'ejc_fk_id' => $request->input('ejc_fk_id'),
            'efc_fk_id' => $request->input('efc_fk_id'),
            'foc_fk_id' => $request->input('foc_fk_id'),
            'cri_borrado' => $request->input('cri_borrado'),
        ])->cri_pk_id;

        return $id;
    }

    public function actualizarControlRiesgo(Request $request, $id) {
        ControlRiesgo::on($this->cliente)->where('cri_pk_id', $id)->update([
            'ger_fk_id' => $request->input('ger_fk_id'),
            'cri_desc' => $request->input('cri_desc'),
            'cgr_fk_id' => $request->input('cgr_fk_id'),
            'cri_responsable' => $request->input('cri_responsable'),
            'tdc_fk_id' => $request->input('tdc_fk_id'),
            'nac_fk_id' => $request->input('nac_fk_id'),
            'pec_fk_id' => $request->input('pec_fk_id'),
            'cri_ref_control' => $request->input('cri_ref_control'),
            'cri_mitiga_1' => $request->input('cri_mitiga_1'),
            'cri_mitiga_2' => $request->input('cri_mitiga_3'),
            'cri_seg_cont_1' => $request->input('cri_seg_cont_1'),
            'cri_seg_cont_2' => $request->input('cri_seg_cont_2'),
            'cri_seg_cont_3' => $request->input('cri_seg_cont_3'),
            'cri_apl_control_1' => $request->input('cri_apl_control_1'),
            'cri_apl_control_2' => $request->input('cri_apl_control_2'),
            'cri_apl_control_otro' => $request->input('cri_apl_control_otro'),
            'dic_fk_id' => $request->input('dic_fk_id'),
            'ejc_fk_id' => $request->input('ejc_fk_id'),
            'efc_fk_id' => $request->input('efc_fk_id'),
            'foc_fk_id' => $request->input('foc_fk_id'),
            'cri_borrado' => $request->input('cri_borrado'),
        ]);

        return response(200);
    }
}
