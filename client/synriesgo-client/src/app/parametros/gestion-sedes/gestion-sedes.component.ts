import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ParametrosService } from 'src/app/services/parametros.service';
import { ErrorConexionComponent } from 'src/app/util/errorConexion/errorConexion.component';
import domToImage from 'dom-to-image';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-gestion-sedes',
  templateUrl: './gestion-sedes.component.html',
  styleUrls: ['./gestion-sedes.component.css']
})
export class GestionSedesComponent implements OnInit {

  @Output() moduloLibre = new EventEmitter();
  @Output() moduloCargando = new EventEmitter();

  public estrategicos: any;
  public misionales: any;
  public apoyo: any;
  public evaluacion: any;

  public procesos: any;
  public procesosSede: any;

  public formulario: FormGroup;

  public cargando: boolean;
  public cargandoCli: boolean;
  public exportando: boolean;

  private msbConfig = new MatSnackBarConfig();

  @ViewChild(ErrorConexionComponent, {static: false}) errorConexion: ErrorConexionComponent | undefined;
  @ViewChild('mapaProcesosSede', { static: false }) public mapaProcesos: ElementRef | undefined;

  constructor(private parametrosService: ParametrosService,
              private snackBar: MatSnackBar) {
    this.parametrosService.actualizarJWTHeaders();

    this.cargando = true;
    this.cargandoCli = false;
    this.exportando = false;

    this.estrategicos = [];
    this.misionales = [];
    this.apoyo = [];
    this.evaluacion = [];

    this.procesos = [];
    this.procesosSede = [];

    this.formulario = new FormGroup({
      filtroProceso: new FormControl(null, null)
    });

    this.msbConfig.duration = 5000;
  }

  get f() { return this.formulario.controls; }

  ngOnInit(): void {
    this.obtenerProcesos().add(() => {
      this.cargando = false;
      this.moduloLibre.emit('3');
    });
  }

  private obtenerProcesos() {
    this.procesos = [];

    return this.parametrosService.obtenerProcesos()
    .subscribe({
      next: (resp: any) => {
        for (const prc of resp) {
          let prcAux = {
            prc_pk_id: prc.prc_pk_id,
            mpc_fk_id: prc.mpc_fk_id,
            prc_nombre: prc.prc_nombre,
            prc_visible: true
          };

          this.procesos.push(prcAux);
        }

        this.procesos.sort((a: any, b: any) => {
          return a.prc_nombre < b.prc_nombre ? -1 : 1
        });
      },
      error: (e: any) => {
        console.log(e);
        this.errorConexion?.activarErrorConexion();
        this.moduloLibre.emit('3');
      }
    });
  }

  public recargarProcesos() {
    this.cargandoCli = true;

    this.f['filtroProceso'].setValue('');
    this.filtrarProcesos();

    setTimeout(() => {
      this.obtenerProcesos().add(() => {
        let proceososAux = this.procesos;

        for (let i = 0; i < this.procesosSede.length; i++) {
          proceososAux = proceososAux.filter((x: any) => { return +x.prc_pk_id !== +this.procesosSede[i].prc_pk_id });
        }

        this.procesos = proceososAux;

        this.cargandoCli = false;
      });
    });
  }

  public filtrarProcesos() {
    if (this.f['filtroProceso'].value != null && this.f['filtroProceso'].value.trim().length >= 3) {
      let elementosBusqueda = this.f['filtroProceso'].value.split(' ');

      for (let i = 0; i < this.procesos.length; i++) {
        let coincidencia = true;

        for (const elm of elementosBusqueda) {
          const regex = new RegExp(elm.toUpperCase(), 'gm');

          if (!regex.test(this.procesos[i].prc_nombre.toUpperCase())) {
            coincidencia = false;
            break;
          }
        }

        this.procesos[i].prc_visible = coincidencia;
      }
    } else if (this.f['filtroProceso'].value != null && this.f['filtroProceso'].value.trim().length < 3) {
      for (let i = 0; i < this.procesos.length; i++) {
        this.procesos[i].prc_visible = true;
      }
    }
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      if (+(event.container.data as any)[event.currentIndex].mpc_fk_id === 1) {
        this.estrategicos.push(event.container.data[event.currentIndex]);
      } else if (+(event.container.data as any)[event.currentIndex].mpc_fk_id === 2) {
        this.misionales.push(event.container.data[event.currentIndex]);
      } else if (+(event.container.data as any)[event.currentIndex].mpc_fk_id === 3) {
        this.apoyo.push(event.container.data[event.currentIndex]);
      } else if (+(event.container.data as any)[event.currentIndex].mpc_fk_id === 4) {
        this.evaluacion.push(event.container.data[event.currentIndex]);
      }

      setTimeout(() => {
        this.ajustarTamanoInputProceso();
      });
    }
  }

  private ajustarTamanoInputProceso() {
    const macroprocesos = [this.estrategicos, this.misionales, this.apoyo, this.evaluacion];
    let id = 1;

    for (const mpc of macroprocesos) {
      for (let i = 0; i < mpc.length; i++) {
        const input: any = document.getElementById('sed' + id.toString() + '-' + i);
        input.size = +input.value.length;
      }

      id++;
    }
  }

  public exportarMapaProcesos(): void {
    this.exportando = true;
    this.moduloCargando.emit('3');

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
        pdf.save('Mapa de procesos sede.pdf');

        this.exportando = false;
        this.moduloLibre.emit('3');
        this.snackBar.open('Guardando mapa de procesos...', 'Cerrar', this.msbConfig);
      }).catch((error: any) => {
        this.exportando = false;
        this.moduloLibre.emit('2');
        this.snackBar.open('No fue posible exportar el mapa de procesos', 'Cerrar', this.msbConfig);
      });
    }, 200);
  }
}
