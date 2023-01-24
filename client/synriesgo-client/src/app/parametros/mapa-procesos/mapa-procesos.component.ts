import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ParametrosService } from 'src/app/services/parametros.service';
import { ErrorConexionComponent } from 'src/app/util/errorConexion/errorConexion.component';
import domToImage from 'dom-to-image';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-mapa-procesos',
  templateUrl: './mapa-procesos.component.html',
  styleUrls: ['./mapa-procesos.component.css']
})
export class MapaProcesosComponent implements OnInit {

  @Input() gestionSedesAbierto: boolean;
  @Output() moduloLibre = new EventEmitter();
  @Output() moduloCargando = new EventEmitter();

  public formulario: FormGroup;

  public estrategicos: any;
  public misionales: any;
  public apoyo: any;
  public evaluacion: any;

  public subprocesos: any;

  public procesoSeleccionado: any;

  public ocultarControles: boolean;
  public persistenciaPendiente: number;
  public persistenciaSprPendiente: number;

  public cargando: boolean;
  public cargandoSpr: boolean;
  public guardando: number;
  public guardandoSpr: number;
  public guardandoGlobal: boolean;
  public guardandoGlobalSpr: boolean;
  public borrando: boolean;
  public borrandoSpr: boolean;
  public exportando: boolean;

  public accionesActivas: boolean;
  public formularioCorrecto: boolean;
  public formularioSprCorrecto: boolean;

  private msbConfig = new MatSnackBarConfig();

  @ViewChild(ErrorConexionComponent, {static: false}) errorConexion: ErrorConexionComponent | undefined;
  @ViewChild('mapaProcesos', { static: false }) public mapaProcesos: ElementRef | undefined;

  constructor(private parametrosService: ParametrosService,
              private snackBar: MatSnackBar) {
    this.parametrosService.actualizarJWTHeaders();

    this.estrategicos = [];
    this.misionales = [];
    this.apoyo = [];
    this.evaluacion = [];

    this.subprocesos = [];

    this.procesoSeleccionado = {mpc_pk_id: null, prc_pk_id: null, prc_nombre: ''};

    this.ocultarControles = false;
    this.persistenciaPendiente = 0;
    this.persistenciaSprPendiente = 0;

    this.cargando = true;
    this.cargandoSpr = false;
    this.guardando = 0;
    this.guardandoSpr = 0;
    this.guardandoGlobal = false;
    this.guardandoGlobalSpr = false;
    this.borrando = false;
    this.borrandoSpr = false;
    this.exportando = false;

    this.accionesActivas = true;
    this.formularioCorrecto = false;
    this.formularioSprCorrecto = false;

    this.gestionSedesAbierto = false;

    this.formulario = new FormGroup({
    });

    this.msbConfig.duration = 5000;
    this.msbConfig.panelClass = ['snackbar']
  }

  get f () { return this.formulario.controls; }

  ngOnInit(): void {
    this.parametrosService.obtenerProcesos()
    .subscribe({
      next: (resp: any) => {
        for (const prc of resp) {
          let prcAux = {
            prc_pk_id: prc.prc_pk_id,
            prc_nombre: prc.prc_nombre,
            prc_asignado: prc.prc_asignado,
            prc_guardando: false,
            prc_actualizado: false,
            conf_borrado: false
          };

          if (+prc.mpc_fk_id === 1) {
            this.estrategicos.push(prcAux);
          } else if (+prc.mpc_fk_id === 2) {
            this.misionales.push(prcAux);
          } else if (+prc.mpc_fk_id === 3) {
            this.apoyo.push(prcAux);
          } else if (+prc.mpc_fk_id === 4) {
            this.evaluacion.push(prcAux);
          }
        }

        this.cargando = false;

        // Ajustar el tamaño de los input
        setTimeout(() => {
          this.ajustarTamanoInputProceso();
        });

        this.moduloLibre.emit('2');
      },
      error: (e: any) => {
        console.log(e);
        this.errorConexion?.activarErrorConexion();
        this.moduloLibre.emit('2');
      }
    });
  }

  onSubmitProceso(macroproceso: number, indice: number) {
    let macroprocesoAux: any = this.getModeloMacroproceso(macroproceso);

    if (macroprocesoAux[indice].prc_guardando == false) {
      this.moduloCargando.emit('2');
      macroprocesoAux[indice].prc_guardando = true;
      this.guardando++;

      this.parametrosService.crearProceso(macroproceso.toString(), macroprocesoAux[indice].prc_nombre)
      .subscribe({
        next: (resp: any) => {
          macroprocesoAux[indice].prc_pk_id = resp;
          macroprocesoAux[indice].prc_guardando = false;
          this.guardando--;
          this.persistenciaPendiente--;

          this.snackBar.open('El proceso fue creado exitosamente', 'Cerrar', this.msbConfig);

          if (this.guardando === 0) {
            this.moduloLibre.emit('2');
          }
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          macroprocesoAux[indice].prc_guardando = false;
          this.guardando--;
          this.moduloLibre.emit('2');
        }
      });
    }
  }

  onSubmitSubproceso(indice: number) {
    if (this.subprocesos[indice].spr_guardando == false) {
      this.moduloCargando.emit('2');
      this.subprocesos[indice].spr_guardando = true;
      this.guardandoSpr++;

      const macroproceso = this.procesoSeleccionado.mpc_pk_id.toString();
      const proceso = this.procesoSeleccionado.prc_pk_id.toString();

      this.parametrosService.crearSubproceso(macroproceso, proceso, this.subprocesos[indice].spr_nombre)
      .subscribe({
        next: (resp: any) => {
          this.subprocesos[indice].spr_pk_id = resp;

          const modeloMacroproceso = this.getModeloMacroproceso(+macroproceso);
          const indiceProceso = modeloMacroproceso.findIndex((x: any) => { return +x.prc_pk_id === +proceso });
          modeloMacroproceso[indiceProceso].prc_asignado = true;

          this.subprocesos[indice].spr_guardando = false;
          this.guardandoSpr--;
          this.persistenciaSprPendiente--;

          this.snackBar.open('El subproceso fue creado exitosamente', 'Cerrar', this.msbConfig);

          if (this.guardandoSpr === 0) {
            this.moduloLibre.emit('2');
          }
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.subprocesos[indice].spr_guardando = false;
          this.guardandoSpr--;
          this.moduloLibre.emit('2');
        }
      });
    }
  }

  onUpdateProceso(macroproceso: number, indice: number) {
    let macroprocesoAux: any = this.getModeloMacroproceso(macroproceso);

    if (macroprocesoAux[indice].prc_guardando == false) {
      this.moduloCargando.emit('2');
      macroprocesoAux[indice].prc_guardando = true;
      this.guardando++;

      this.parametrosService.actualizarProceso(macroprocesoAux[indice].prc_pk_id, macroprocesoAux[indice].prc_nombre)
      .subscribe({
        next: (resp: any) => {
          macroprocesoAux[indice].prc_pk_id = resp;
          macroprocesoAux[indice].prc_guardando = false;
          macroprocesoAux[indice].prc_actualizado = false;
          this.guardando--;
          this.persistenciaPendiente--;

          this.snackBar.open('El proceso fue actualizado exitosamente', 'Cerrar', this.msbConfig);

          if (this.guardando === 0) {
            this.moduloLibre.emit('2');
          }
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          macroprocesoAux[indice].prc_guardando = false;
          this.guardando--;
          this.moduloLibre.emit('2');
        }
      });
    }
  }

  onUpdateSubproceso(indice: number) {
    if (this.subprocesos[indice].spr_guardando == false) {
      this.moduloCargando.emit('2');
      this.subprocesos[indice].spr_guardando = true;
      this.guardandoSpr++;

      this.parametrosService.actualizarSubproceso(this.subprocesos[indice].spr_pk_id, this.subprocesos[indice].spr_nombre)
      .subscribe({
        next: (resp: any) => {
          this.subprocesos[indice].spr_pk_id = resp;
          this.subprocesos[indice].spr_guardando = false;
          this.subprocesos[indice].spr_actualizado = false;
          this.guardandoSpr--;
          this.persistenciaSprPendiente--;

          this.snackBar.open('El subproceso fue actualizado exitosamente', 'Cerrar', this.msbConfig);

          if (this.guardandoSpr === 0) {
            this.moduloLibre.emit('2');
          }
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.subprocesos[indice].spr_guardando = false;
          this.guardandoSpr--;
          this.moduloLibre.emit('2');
        }
      });
    }
  }

  onSubmitMasivoProceso() {
    if (this.accionesActivas && this.formularioCorrecto) {
      this.guardandoGlobal = true;
      this.moduloCargando.emit('2');
      this.accionesActivas = false;

      this.parametrosService.persistenciaMasivaProcesos(this.estrategicos, this.misionales, this.apoyo, this.evaluacion)
      .subscribe({
        next: (resp: any) => {
          this.estrategicos = resp[0];
          this.misionales = resp[1];
          this.apoyo = resp[2];
          this.evaluacion = resp[3];

          setTimeout(() => {
            this.ajustarTamanoInputProceso();
          })

          this.persistenciaPendiente = 0;
          this.guardandoGlobal = false;
          this.accionesActivas = true;
          this.moduloLibre.emit('2');

          this.snackBar.open('Todos los cambios fueron guardados exitosamente', 'Cerrar', this.msbConfig);
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.accionesActivas = true;
          this.guardandoGlobal = false;
          this.moduloLibre.emit('2');
        }
      });
    }
  }

  onSubmitMasivoSubproceso() {
    if (this.accionesActivas && this.formularioSprCorrecto) {
      this.guardandoGlobalSpr = true;
      this.moduloCargando.emit('2');
      this.accionesActivas = false;

      const macroproceso = this.subprocesos[0].mpc_fk_id;
      const proceso = this.subprocesos[0].prc_fk_id;

      this.parametrosService.persistenciaMasivaSubprocesos(macroproceso, proceso, this.subprocesos)
      .subscribe({
        next: (resp: any) => {
          this.subprocesos = resp;

          setTimeout(() => {
            this.ajustarTamanoInputSubproceso();
          });

          const modeloMacroproceso = this.getModeloMacroproceso(+macroproceso);
          const indiceProceso = modeloMacroproceso.findIndex((x: any) => { return +x.prc_pk_id === +proceso });
          modeloMacroproceso[indiceProceso].prc_asignado = true;

          this.persistenciaSprPendiente = 0;
          this.guardandoGlobalSpr = false;
          this.accionesActivas = true;
          this.moduloLibre.emit('2');

          this.snackBar.open('Todos los cambios fueron guardados exitosamente', 'Cerrar', this.msbConfig);
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.accionesActivas = true;
          this.guardandoGlobalSpr = false;
          this.moduloLibre.emit('2');
        }
      });
    }
  }

  onDeleteProceso(macroproceso: number, indice: number) {
    let macroprocesoAux: any = this.getModeloMacroproceso(macroproceso);

    if (macroprocesoAux[indice].prc_guardando == false) {
      this.moduloCargando.emit('2');
      macroprocesoAux[indice].prc_guardando = true;
      this.borrando = true;

      this.snackBar.open('Borrando...', 'Cerrar', this.msbConfig);

      const id: number = +macroprocesoAux[indice].prc_pk_id;

      this.parametrosService.borrarProceso(id.toString())
      .subscribe({
        next: () => {
          if (macroproceso === 1) {
            this.estrategicos = this.estrategicos.filter((x: any) => { return +x.prc_pk_id !== id });
          } else if (macroproceso === 2) {
            this.misionales = this.misionales.filter((x: any) => { return +x.prc_pk_id !== id });
          } else if (macroproceso === 3) {
            this.apoyo = this.apoyo.filter((x: any) => { return +x.prc_pk_id !== id });
          } else if (macroproceso === 4) {
            this.evaluacion = this.evaluacion.filter((x: any) => { return +x.prc_pk_id !== id });
          }

          this.borrando = false;
          this.moduloLibre.emit('2');
          this.snackBar.open('El proceso fue borrado exitosamente', 'Cerrar', this.msbConfig);
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          macroprocesoAux[indice].prc_guardando = false;
          macroprocesoAux[indice].conf_borrado = false;
          this.borrando = false;
          this.moduloLibre.emit('2');
        }
      });
    }
  }

  onDeleteSubproceso(indice: number) {
    if (this.subprocesos[indice].spr_guardando == false) {
      this.moduloCargando.emit('2');
      this.subprocesos[indice].spr_guardando = true;
      this.borrandoSpr = true;

      this.snackBar.open('Borrando...', undefined, this.msbConfig);

      const mpc_fk_id: number = +this.subprocesos[indice].mpc_fk_id;
      const prc_fk_id: number = +this.subprocesos[indice].prc_fk_id;
      const id: number = +this.subprocesos[indice].spr_pk_id;

      this.parametrosService.borrarSubproceso(id.toString(), prc_fk_id.toString())
      .subscribe({
        next: () => {
          this.subprocesos = this.subprocesos.filter((x: any) => { return +x.spr_pk_id !== id });

          if (this.subprocesos.length === 0) {
            let indice = -1;

            if (+mpc_fk_id == 1) {
              indice = this.estrategicos.findIndex((x: any) => { return +x.prc_pk_id === +prc_fk_id });
              this.estrategicos[indice].prc_asignado = false;
            } else if (+mpc_fk_id == 2) {
              indice = this.misionales.findIndex((x: any) => { return +x.prc_pk_id === +prc_fk_id });
              this.misionales[indice].prc_asignado = false;
            } else if (+mpc_fk_id == 3) {
              indice = this.apoyo.findIndex((x: any) => { return +x.prc_pk_id === +prc_fk_id });
              this.apoyo[indice].prc_asignado = false;
            } else if (+mpc_fk_id == 4) {
              indice = this.evaluacion.findIndex((x: any) => { return +x.prc_pk_id === +prc_fk_id });
              this.evaluacion[indice].prc_asignado = false;
            }
          }

          this.borrandoSpr = false;
          this.moduloLibre.emit('2');
          this.snackBar.open('El subproceso fue borrado exitosamente', 'Cerrar', this.msbConfig);
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.subprocesos[indice].spr_guardando = false;
          this.subprocesos[indice].conf_borrado = false;
          this.borrandoSpr = false;
          this.moduloLibre.emit('2');
        }
      });
    }
  }

  agregarProceso(macroproceso: number) {
    let macroprocesoAux: any = this.getModeloMacroproceso(macroproceso);

    const indice = macroprocesoAux.length - 1;

    if (macroprocesoAux.length === 0 || (macroprocesoAux[indice].prc_nombre != null && macroprocesoAux[indice].prc_nombre.trim() != '')) {
      macroprocesoAux.push({
        prc_pk_id: null,
        prc_nombre: '',
        prc_asignado: false,
        prc_guardando: false,
        prc_actualizado: false,
        conf_borrado: false
      });

      this.revisarFormulario();
      this.persistenciaPendiente++;
    }
  }

  agregarSubproceso() {
    const indice = this.subprocesos.length - 1;

    const macroproceso = this.procesoSeleccionado.mpc_pk_id;
    const proceso = this.procesoSeleccionado.prc_pk_id;

    if (this.subprocesos.length === 0 || (this.subprocesos[indice].spr_nombre != null && this.subprocesos[indice].spr_nombre.trim() != '')) {
      this.subprocesos.push({
        spr_pk_id: null,
        mpc_fk_id: macroproceso,
        prc_fk_id: proceso,
        spr_nombre: '',
        spr_guardando: false,
        spr_actualizado: false,
        conf_borrado: false
      });

      this.revisarFormularioSubprocesos();
      this.persistenciaSprPendiente++;
    }
  }

  gestionarActualizacionProceso(macroproceso: number, indice: number) {
    let macroprocesoAux: any = this.getModeloMacroproceso(macroproceso);

    if (macroprocesoAux[indice].prc_pk_id !== null) {
      if (!macroprocesoAux[indice].prc_actualizado) {
        this.persistenciaPendiente++;
      }

      macroprocesoAux[indice].prc_actualizado = true;
    }

    this.revisarFormulario();
  }

  gestionarActualizacionSubproceso(indice: number) {
    if (this.subprocesos[indice].spr_pk_id !== null) {
      if (!this.subprocesos[indice].spr_actualizado) {
        this.persistenciaSprPendiente++;
      }

      this.subprocesos[indice].spr_actualizado = true;
    }

    this.revisarFormularioSubprocesos();
  }

  quitarProceso(macroproceso: number, indice: number) {
    let macroprocesoAux: any = this.getModeloMacroproceso(macroproceso);

    if (macroprocesoAux[indice].prc_pk_id === null) {
      macroprocesoAux.splice(indice, 1);
      this.persistenciaPendiente--;
    } else {
      const id = macroprocesoAux[indice].prc_pk_id;

      this.snackBar.open(`Al borrar el proceso, también se borrarán los subprocesos asociados.
                          Haga clic en el botón nuevamente para confirmar`, 'Cerrar', this.msbConfig);
      macroprocesoAux[indice].conf_borrado = true;

      setTimeout(() => {
        const indiceAux = macroprocesoAux.findIndex((x: any) => { return +x.prc_pk_id === +id });

        if (+indiceAux !== -1) {
          macroprocesoAux[indiceAux].conf_borrado = false;
        }
      }, 5000);
    }
  }

  quitarSubproceso(indice: number) {
    if (this.subprocesos[indice].spr_pk_id === null) {
      this.subprocesos.splice(indice, 1);
      this.persistenciaSprPendiente--;
    } else {
      const id = this.subprocesos[indice].spr_pk_id;

      this.snackBar.open(`Haga clic en el botón nuevamente para confirmar`, 'Cerrar', this.msbConfig);
      this.subprocesos[indice].conf_borrado = true;

      setTimeout(() => {
        const indiceAux = this.subprocesos.findIndex((x: any) => { return +x.spr_pk_id === +id });

        if (+indiceAux !== -1) {
          this.subprocesos[indiceAux].conf_borrado = false;
        }
      }, 5000);
    }
  }

  gestionarSeleccionProceso(macroproceso: number, indice: number) {
    let macroprocesoAux: any = this.getModeloMacroproceso(macroproceso);

    this.procesoSeleccionado = {
      mpc_pk_id: macroproceso,
      prc_pk_id: macroprocesoAux[indice].prc_pk_id,
      prc_nombre: macroprocesoAux[indice].prc_nombre
    };

    this.subprocesos = [];

    this.cargandoSpr = true;
    this.moduloCargando.emit('2');

    this.parametrosService.obtenerSubprocesos(this.procesoSeleccionado.prc_pk_id)
    .subscribe({
      next: (resp: any) => {
        for (let spr of resp) {
          let subproceso = {
            spr_pk_id: spr.spr_pk_id,
            mpc_fk_id: spr.mpc_fk_id,
            prc_fk_id: spr.prc_fk_id,
            spr_nombre: spr.spr_nombre,
            spr_guardando: false,
            spr_actualizado: false,
            conf_borrado: false
          }

          this.subprocesos.push(subproceso);
        }

        this.cargandoSpr = false;

        setTimeout(() => {
          this.ajustarTamanoInputSubproceso();
        });

        setTimeout(() => {
          this.moduloLibre.emit('2');
        }, 200);
      },
      error: (e: any) => {
        console.log(e);
        this.cargandoSpr = false;
        this.moduloLibre.emit('2');
        this.errorConexion?.activarErrorConexion();
      }
    });
  }

  private getModeloMacroproceso(macroproceso: number) {
    let macroprocesoAux: any;

    if (macroproceso === 1) {
      macroprocesoAux = this.estrategicos;
    } else if (macroproceso === 2) {
      macroprocesoAux = this.misionales;
    } else if (macroproceso === 3) {
      macroprocesoAux = this.apoyo;
    } else if (macroproceso === 4) {
      macroprocesoAux = this.evaluacion;
    }

    return macroprocesoAux;
  }

  public limipiarSubprocesos() {
    this.subprocesos = [];
  }

  private ajustarTamanoInputProceso() {
    const macroprocesos = [this.estrategicos, this.misionales, this.apoyo, this.evaluacion];
    let id = 1;

    for (const mpc of macroprocesos) {
      for (let i = 0; i < mpc.length; i++) {
        const input: any = document.getElementById(id.toString() + '-' + i);
        input.size = +input.value.length;
      }

      id++;
    }
  }

  private ajustarTamanoInputSubproceso() {
    for (let i = 0; i < this.subprocesos.length; i++) {
      const input: any = document.getElementById('spr-' + i);
      input.size = +input.value.length;
    }
  }

  revisarFormulario() {
    const macroprocesos = [this.estrategicos, this.misionales, this.apoyo, this.evaluacion];

    for (const mpc of macroprocesos) {
      for (const prc of mpc) {
        if (prc.prc_nombre == null || prc.prc_nombre.trim() == '') {
          this.formularioCorrecto = false;
          return;
        }
      }
    }

    this.formularioCorrecto = true;
  }

  revisarFormularioSubprocesos() {
    for (const spr of this.subprocesos) {
      if (spr.spr_nombre == null || spr.spr_nombre.trim() == '') {
        this.formularioSprCorrecto = false;
        return;
      }
    }

    this.formularioSprCorrecto = true;
  }

  public exportarMapaProcesos(): void {
    this.exportando = true;
    this.ocultarControles = true;
    this.moduloCargando.emit('2');

    setTimeout(() => {
      const width = this.mapaProcesos!.nativeElement.clientWidth;
      const height = this.mapaProcesos!.nativeElement.clientHeight + 40;

      domToImage.toPng(this.mapaProcesos!.nativeElement, {width: width, height: height})
      .then((result: any) => {
        const pdf = new jsPDF({
          orientation: width > height ? "landscape" : "portrait",
          unit: "pt",
          format: [width + 50, height + 220]
        });

        pdf.addImage(result, 'PNG', 25, 25, width, height);
        pdf.save('Mapa de procesos.pdf');

        this.ocultarControles = false;
        this.exportando = false;
        this.moduloLibre.emit('2');
        this.snackBar.open('Guardando mapa de procesos...', 'Cerrar', this.msbConfig);
      }).catch((error: any) => {
        this.exportando = false;
        this.moduloLibre.emit('2');
        this.snackBar.open('No fue posible exportar el mapa de procesos', 'Cerrar', this.msbConfig);
      });
    }, 200);
  }
}

