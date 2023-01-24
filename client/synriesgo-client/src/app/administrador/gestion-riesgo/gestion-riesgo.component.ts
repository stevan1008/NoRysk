import { Component, EventEmitter, OnInit, Output, ViewChild  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GestionRiesgoService } from 'src/app/services/gestion-riesgo.service';
import { ErrorConexionComponent } from 'src/app/util/errorConexion/errorConexion.component';

@Component({
  selector: 'app-gestion-riesgo',
  templateUrl: './gestion-riesgo.component.html',
  styleUrls: ['./gestion-riesgo.component.css']
})
export class GestionRiesgoComponent implements OnInit {

  @Output() moduloLibre = new EventEmitter();
  @Output() moduloCargando = new EventEmitter();

  public formulario: FormGroup;
  public categoriasGestionRiesgo: any[];
  public clasificacionesGestionRiesgo: any[];
  public tiposRiesgo: any[];
  public fallasGestionRiesgo: any[];
  public fallasGestionRiesgo2: any[];
  public factoresRiesgo: any[];
  public probabilidades: any[];
  public impactos: any[];

  // Filtros
  public filtroTipoRiesgo: any;
  public filtroFallas: any;

  @ViewChild(ErrorConexionComponent, {static: false}) errorConexion: ErrorConexionComponent | undefined;

  constructor(private gestionRiesgoService: GestionRiesgoService) {
    this.gestionRiesgoService.actualizarJWTHeaders();
    this.categoriasGestionRiesgo = require('src/app/util/auxiliaresBaseDeDatos/categoriaGestionRiesgo.json');
    this.clasificacionesGestionRiesgo = require('src/app/util/auxiliaresBaseDeDatos/clasificacionGestionRiesgo.json');
    this.tiposRiesgo = require('src/app/util/auxiliaresBaseDeDatos/tipoRiesgo.json');
    this.fallasGestionRiesgo = require('src/app/util/auxiliaresBaseDeDatos/fallaGestionRiesgo.json');
    this.fallasGestionRiesgo2 = require('src/app/util/auxiliaresBaseDeDatos/fallaGestionRiesgo2.json');
    this.factoresRiesgo = require('src/app/util/auxiliaresBaseDeDatos/factorRiesgo.json');
    this.probabilidades = require('src/app/util/auxiliaresBaseDeDatos/probabilidad.json');
    this.impactos = require('src/app/util/auxiliaresBaseDeDatos/impacto.json');
    this.formulario = new FormGroup({
      sede: new FormControl(null, null),
      proceso: new FormControl(null, null),
      subproceso: new FormControl(null, null),
      // descRiesgo: new FormControl(null, [Validators.required]),
      categoria: new FormControl(null, [Validators.required]),
      clasificacion: new FormControl(null, [Validators.required]),
      tipoRiesgo: new FormControl(null, [Validators.required]),

      fallaRiesgo0: new FormControl(false, null),
      fallaRiesgo1: new FormControl(false, null),
      fallaRiesgo2: new FormControl(false, null),
      fallaRiesgo3: new FormControl(false, null),
      fallaRiesgo4: new FormControl(false, null),
      fallaRiesgo5: new FormControl(false, null),
      fallaRiesgo6: new FormControl(false, null),
      fallaRiesgo7: new FormControl(false, null),
      fallaRiesgo8: new FormControl(false, null),
      fallaRiesgo9: new FormControl(false, null),
      fallaRiesgo10: new FormControl(false, null),
      fallaRiesgo11: new FormControl(false, null),
      fallaRiesgo12: new FormControl(false, null),
      fallaRiesgo13: new FormControl(false, null),
      fallaRiesgo14: new FormControl(false, null),
      fallaRiesgo15: new FormControl(false, null),
      fallaRiesgo16: new FormControl(false, null),
      fallaRiesgo17: new FormControl(false, null),
      fallaRiesgo18: new FormControl(false, null),
      fallaRiesgo19: new FormControl(false, null),
      fallaRiesgo20: new FormControl(false, null),
      fallaRiesgo21: new FormControl(false, null),
      fallaRiesgo22: new FormControl(false, null),
      fallaRiesgo23: new FormControl(false, null),
      fallaRiesgo24: new FormControl(false, null),

      factorRiesgo: new FormControl(null, [Validators.required]),
      descMaterializacion: new FormControl(null, [Validators.required]),

      actividadRiesgoAfectado: new FormControl(null, null),

      pilaresAfectados1: new FormControl(false, null),
      pilaresAfectados2: new FormControl(false, null),
      pilaresAfectados3: new FormControl(false, null),

      probabilidad: new FormControl(null, [Validators.required]),
      impacto: new FormControl(null, [Validators.required]),
    })

    // Inicialización filtros
    this.filtroTipoRiesgo = this.tiposRiesgo.slice();
    this.filtroFallas = this.fallasGestionRiesgo.slice();
  }

  ngOnInit(): void {
  }

  get f () { return this.formulario.controls }

  limpiarSaltoClasificacion() {
    if (+this.f['clasificacion'].value !== 4) {
      this.f['actividadRiesgoAfectado'].setValue('');
      this.f['pilaresAfectados1'].setValue(false);
      this.f['pilaresAfectados2'].setValue(false);
      this.f['pilaresAfectados3'].setValue(false);
    }
  }

  onSubmit() {
    if (this.revisarFormulario()) {
      this.moduloCargando.emit('0');
      const DATA = {
        // sede: this.f['sede'].value,
        // proceso: this.f['proceso'].value,
        // subproceso: this.f['subproceso'].value,
        sed_fk_id: '12',
        prc_fk_id: '8',
        spr_fk_id: '3',
        cgr_fk_id: this.f['categoria'].value,
        clr_fk_id: this.f['clasificacion'].value,
        tpr_fk_id: this.f['tipoRiesgo'].value,
        ger_fallo_riesgo_0: this.f['fallaRiesgo0'].value,
        ger_fallo_riesgo_1: this.f['fallaRiesgo1'].value,
        ger_fallo_riesgo_2: this.f['fallaRiesgo2'].value,
        ger_fallo_riesgo_3: this.f['fallaRiesgo3'].value,
        ger_fallo_riesgo_4: this.f['fallaRiesgo4'].value,
        ger_fallo_riesgo_5: this.f['fallaRiesgo5'].value,
        ger_fallo_riesgo_6: this.f['fallaRiesgo6'].value,
        ger_fallo_riesgo_7: this.f['fallaRiesgo7'].value,
        ger_fallo_riesgo_8: this.f['fallaRiesgo8'].value,
        ger_fallo_riesgo_9: this.f['fallaRiesgo9'].value,
        ger_fallo_riesgo_10: this.f['fallaRiesgo10'].value,
        ger_fallo_riesgo_11: this.f['fallaRiesgo11'].value,
        ger_fallo_riesgo_12: this.f['fallaRiesgo12'].value,
        ger_fallo_riesgo_13: this.f['fallaRiesgo13'].value,
        ger_fallo_riesgo_14: this.f['fallaRiesgo14'].value,
        ger_fallo_riesgo_15: this.f['fallaRiesgo15'].value,
        ger_fallo_riesgo_16: this.f['fallaRiesgo16'].value,
        ger_fallo_riesgo_17: this.f['fallaRiesgo17'].value,
        ger_fallo_riesgo_18: this.f['fallaRiesgo18'].value,
        ger_fallo_riesgo_19: this.f['fallaRiesgo19'].value,
        ger_fallo_riesgo_20: this.f['fallaRiesgo20'].value,
        ger_fallo_riesgo_21: this.f['fallaRiesgo21'].value,
        ger_fallo_riesgo_22: this.f['fallaRiesgo22'].value,
        ger_fallo_riesgo_23: this.f['fallaRiesgo23'].value,
        ger_fallo_riesgo_24: this.f['fallaRiesgo24'].value,
        far_fk_id: this.f['factorRiesgo'].value,
        ger_desc_materializacion: this.f['descMaterializacion'].value,
        // ger_activo_afectado: this.f['actividadRiesgoAfectado'].value,
        ger_activo_afectado: 'AFECTADOOO',
        ger_pilares_afectados_1: this.f['pilaresAfectados1'].value,
        ger_pilares_afectados_2: this.f['pilaresAfectados2'].value,
        ger_pilares_afectados_3: this.f['pilaresAfectados3'].value,
        prb_fk_id: this.f['probabilidad'].value,
        imp_fk_id: this.f['impacto'].value,
        ger_borrado: false
      }

      this.gestionRiesgoService.crearGestionRiesgo(DATA)
      .subscribe({
        next: (resp: any) => {
          console.log("Response from onSumbit: ", resp);
        },
        error: (e: Error) => {
          console.error(e);
        }
      })
    }
  }

  onUpdate() {
    
  }

  revisarFormulario() {
    if (this.formulario.valid && (+this.f['clasificacion'].value === 4) && 
      (this.f['fallaRiesgo0'].value !== false || this.f['fallaRiesgo1'].value !== false || this.f['fallaRiesgo2'].value !== false ||
       this.f['fallaRiesgo3'].value !== false || this.f['fallaRiesgo4'].value !== false || this.f['fallaRiesgo5'].value !== false ||
       this.f['fallaRiesgo6'].value !== false || this.f['fallaRiesgo7'].value !== false || this.f['fallaRiesgo8'].value !== false ||
       this.f['fallaRiesgo9'].value !== false || this.f['fallaRiesgo10'].value !== false || this.f['fallaRiesgo11'].value !== false ||
       this.f['fallaRiesgo12'].value !== false || this.f['fallaRiesgo13'].value !== false || this.f['fallaRiesgo14'].value !== false ||
       this.f['fallaRiesgo15'].value !== false || this.f['fallaRiesgo16'].value !== false || this.f['fallaRiesgo17'].value !== false ||
       this.f['fallaRiesgo18'].value !== false || this.f['fallaRiesgo19'].value !== false || this.f['fallaRiesgo20'].value !== false ||
       this.f['fallaRiesgo21'].value !== false || this.f['fallaRiesgo22'].value !== false || this.f['fallaRiesgo23'].value !== false ||
       this.f['fallaRiesgo24'].value !== false)) {
      if (this.f['actividadRiesgoAfectado'].value !== null && 
          (this.f['pilaresAfectados1'].value !== false ||
          this.f['pilaresAfectados2'].value !== false ||
          this.f['pilaresAfectados3'].value !== false)) {
           return true 
      } else {
            return false
      }   
    } else if (this.formulario.valid && (+this.f['clasificacion'].value !== 4)) {
      return true
    } else {
      return false
    }
  }

}