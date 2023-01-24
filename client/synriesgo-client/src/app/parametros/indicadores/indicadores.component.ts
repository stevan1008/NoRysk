import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css']
})

export class IndicadoresComponent implements OnInit {

  public formulario: FormGroup;
  public macroprocesos: any[];
  public htmlContent: any;
  public unidades: any[];
  public tendenciasEsperadas: any[]; 
  public periodicidades: any[];
  public rangosEvaluacion: any[];
  public tiposMedidads: any[];
  public personasComunicar: any[];
  public mediosComunicar: any[];

  constructor() {
    this.macroprocesos = require('src/app/util/auxiliaresBaseDeDatos/macroprocesos.json');
    this.unidades = require('src/app/util/auxiliaresBaseDeDatos/unidades.json');
    this.tendenciasEsperadas = require('src/app/util/auxiliaresBaseDeDatos/tendenciaEsperada.json');
    this.periodicidades = require('src/app/util/auxiliaresBaseDeDatos/periodicidades.json');
    this.rangosEvaluacion = require('src/app/util/auxiliaresBaseDeDatos/rangosEvaluacion.json');
    this.tiposMedidads = require('src/app/util/auxiliaresBaseDeDatos/tiposMedidas.json');
    this.formulario = new FormGroup({
      fechaCreacion: new FormControl(null, null),
      descripcion: new FormControl(null, null),
      nombreIndicador: new FormControl(null, null),
      objetivoIndicador: new FormControl(null, null),
      categoriaIndicador: new FormControl(null, null),
      formulaIndicador: new FormControl(null, null),
      unidadIndicador: new FormControl(null, null),
      tendenciaIndicador: new FormControl(null, null),
      periodicidadIndicador: new FormControl(null, null),
      metaIndicador: new FormControl(null, null),
      rangosEvaluacion: new FormControl(null, null),
      valorRango: new FormControl(null, null),

      tipoDefVar: new FormControl(null, null),
      nombreVariable: new FormControl(null, null),
      fuenteVar: new FormControl(null, null),
      formulaVariable: new FormControl(null, null),

      nombreRev: new FormControl(null, null),
      cargoRev: new FormControl(null, null),

      nombreAprob: new FormControl(null, null),
      cargoAprob: new FormControl(null, null),
    })
    this.personasComunicar = [];
    this.mediosComunicar = [];
    this.gestionarPersonasCom();
    this.gestionarMediosCom();
  }

  ngOnInit(): void {
  }

  get f() {
    return this.formulario.controls;
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  gestionarPersonasCom() {
    let elementos = 1;
    for(let i = 1; i <= elementos; i++) {
      this.personasComunicar.push({
        nombre_persona: null 
      })
    }
  }

  gestionarMediosCom() {
    let elementos = 1;
    for(let i = 1; i <= elementos; i++) {
      this.mediosComunicar.push({
        medio_desc: null 
      })
    }
  }
}
