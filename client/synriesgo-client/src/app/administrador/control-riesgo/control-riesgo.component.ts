import { Component, EventEmitter, OnInit, Output, ViewChild  } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorConexionComponent } from 'src/app/util/errorConexion/errorConexion.component';
import { ControlRiesgoService } from 'src/app/services/control-riesgo.service';

@Component({
  selector: 'app-control-riesgo',
  templateUrl: './control-riesgo.component.html',
  styleUrls: ['./control-riesgo.component.css']
})
export class ControlRiesgoComponent implements OnInit {

  @Output() moduloLibre = new EventEmitter();
  @Output() moduloCargando = new EventEmitter();

  public formulario: FormGroup;

  public categoriaGestionRiesgo: any[];
  public tiposControl: any[];
  public naturalezaControl: any[];
  public periodicidadControl: any[];
  public disenoControl: any[];
  public ejecucionControl: any[];
  public efectividadControl: any[];
  public fortalezaControl: any[];

  public formularioCorrecto: boolean;

  public dataStored: any[];

  @ViewChild(ErrorConexionComponent, {static: false}) errorConexion: ErrorConexionComponent | undefined;

  constructor(private controlRiesgoService: ControlRiesgoService) {
    this.categoriaGestionRiesgo = require('src/app/util/auxiliaresBaseDeDatos/categoriaGestionRiesgo.json');
    this.tiposControl = require('src/app/util/auxiliaresBaseDeDatos/tipoControl.json');
    this.naturalezaControl = require('src/app/util/auxiliaresBaseDeDatos/naturalezaControl.json');
    this.periodicidadControl = require('src/app/util/auxiliaresBaseDeDatos/periodicidadControl.json');
    this.disenoControl = require('src/app/util/auxiliaresBaseDeDatos/disenoControl.json');
    this.ejecucionControl = require('src/app/util/auxiliaresBaseDeDatos/ejecucionControl.json');
    this.efectividadControl = require('src/app/util/auxiliaresBaseDeDatos/efectividadControl.json');
    this.fortalezaControl = require('src/app/util/auxiliaresBaseDeDatos/fortalezaControl.json');
    this.formulario = new FormGroup({

    })
    this.dataStored = [];
    this.gestionarData();
    this.formularioCorrecto = false;
  }

  ngOnInit(): void {
  }

  gestionarData() {
    let elementos = 1;
    for(let i = 1; i <= elementos; i++) {
      this.dataStored.push({
        cri_desc: null,
        cgr_fk_id: null,
        cri_responsable: null,
        tdc_fk_id: null,
        nac_fk_id: null,
        pec_fk_id: null,
        cri_ref_control: null,
        // fallaAtaca: null,

        cri_mitiga_1: false,
        cri_mitiga_2: false,

        cri_seg_cont_1: false,
        cri_seg_cont_2: false,
        cri_seg_cont_3: false,

        cri_apl_control_1: false,
        cri_apl_control_2: false,
        cri_apl_control_otro: null,

        dic_fk_id: null,
        ejc_fk_id: null,
        efc_fk_id: null,
        foc_fk_id: null,
        cri_borrado: false,
      })
    }
  }

  onSubmit() {
    console.log(this.dataStored);
    console.log(JSON.stringify(this.dataStored));
    this.controlRiesgoService.crearControlRiesgo(this.dataStored)
    .subscribe({
      next: (resp: any) => {
        console.log(resp);
      },
      error: (err: Error) => {
        console.error(err);
      }
    })    
  }

  revisarFormulario(): void {
    this.dataStored.forEach((riesgo: any) => {
      if (riesgo.cri_desc !== null && riesgo.cgr_fk_id !== null && 
          riesgo.cri_responsable !== null && riesgo.tdc_fk_id !== null && 
          riesgo.nac_fk_id !== null && riesgo.pec_fk_id !== null && 
          riesgo.cri_ref_control !== null && // riesgo.fallaAtaca !== null &&
          (riesgo.cri_mitiga_1 !== false || riesgo.cri_mitiga_2 !== false) && 
          (riesgo.cri_seg_cont_1 !== false || riesgo.cri_seg_cont_2 !== false && riesgo.cri_seg_cont_3 !== false) &&
          riesgo.dic_fk_id !== null && riesgo.ejc_fk_id !== null &&
          riesgo.efc_fk_id !== null && riesgo.foc_fk_id !== null &&
          (riesgo.cri_apl_control_1 !== false || (riesgo.cri_apl_control_2 !== false && riesgo.cri_apl_control_otro !== null))) {
          this.formularioCorrecto = true;
      } else {
        this.formularioCorrecto = false;
      }
    })
    console.log(this.dataStored)
  }

}
