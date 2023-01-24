import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParametrosService } from 'src/app/services/parametros.service';
import { ErrorConexionComponent } from 'src/app/util/errorConexion/errorConexion.component';

@Component({
  selector: 'app-planeacion-estrategica',
  templateUrl: './planeacion-estrategica.component.html',
  styleUrls: ['./planeacion-estrategica.component.css']
})
export class PlaneacionEstrategicaComponent implements OnInit {
  @Output() moduloLibre = new EventEmitter();
  @Output() moduloCargando = new EventEmitter();

  public formulario: FormGroup;

  public objetivos: any[];

  public cargandoFormulario: boolean;
  public cargandoGuardado: boolean;

  public objetivosCorrectos: boolean;
  public formularioCorrecto: boolean;
  public accionesActivas: boolean;
  public idFormulario: string | null;
  public hayCambios: boolean;

  @ViewChild(ErrorConexionComponent, {static: false}) errorConexion: ErrorConexionComponent | undefined;

  constructor(private parametrosService: ParametrosService,
              private snackBar: MatSnackBar) {
    this.parametrosService.actualizarJWTHeaders();

    this.objetivos = [];

    this.cargandoFormulario = true;
    this.cargandoGuardado = false;

    this.objetivosCorrectos = false;
    this.formularioCorrecto = false;
    this.accionesActivas = true;
    this.idFormulario = null;
    this.hayCambios = false;

    this.formulario = new FormGroup({
      mision: new FormControl(null, Validators.required),
      vision: new FormControl(null, Validators.required)
    });
  }

  get f() { return this.formulario.controls }

  ngOnInit(): void {
    let parametrosCargados = 0;

    this.parametrosService.obtenerMisionVision()
    .subscribe({
      next: (resp: any) => {
        if (resp[0] !== undefined) {
          this.idFormulario = resp[0].pes_pk_id.toString();

          this.f['mision'].setValue(resp[0].pes_mision);
          this.f['vision'].setValue(resp[0].pes_vision);

          this.objetivosCorrectos = true;
          this.formularioCorrecto = true;
          this.hayCambios = false;
        }

        parametrosCargados++;

        if (parametrosCargados >= 2) {
          setTimeout(() => {
            this.cargandoFormulario = false;
            this.moduloLibre.emit('1');
          }, 300)
        }
      },
      error: (e: any) => {
        console.log(e);
        this.errorConexion?.activarErrorConexion();
        this.cargandoFormulario = false;
        this.moduloLibre.emit('1');
      }
    });

    this.parametrosService.obtenerObjetivos()
    .subscribe({
      next: (resp: any) => {
        this.objetivos = resp;

        for (let i = 0; i < this.objetivos.length; i++) {
          this.objetivos[i].peo_actualizado = false;
          this.objetivos[i].peo_borrado = false;
        }

        parametrosCargados++;

        if (parametrosCargados >= 2) {
          setTimeout(() => {
            this.cargandoFormulario = false;
            this.moduloLibre.emit('1');
          }, 300)
        }
      },
      error: (e: any) => {
        console.log(e);
        this.errorConexion?.activarErrorConexion();
        this.cargandoFormulario = false;
        this.moduloLibre.emit('1');
      }
    });
  }

  onSubmit() {
    if (this.formularioCorrecto && this.accionesActivas) {
      this.moduloCargando.emit('1');
      this.accionesActivas = false;
      this.cargandoGuardado = true;

      this.parametrosService.crearPlaneacionEstrategica(this.f['mision'].value, this.f['vision'].value, this.objetivos)
      .subscribe({
        next: (resp: any) => {
          this.idFormulario = resp[0];
          this.objetivos = resp[1];

          this.hayCambios = false;
          this.accionesActivas = true;
          this.cargandoGuardado = false;
          this.moduloLibre.emit('1');

          this.snackBar.open('La planeación estratégica fue guardado exitosamente', 'Cerrar');
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.accionesActivas = true;
          this.cargandoGuardado = false;
          this.moduloLibre.emit('1');
        }
      });
    }
  }

  onUpdate() {
    if (this.formularioCorrecto && this.accionesActivas) {
      this.moduloCargando.emit('1');
      this.accionesActivas = false;
      this.cargandoGuardado = true;

      this.parametrosService.actualizarPlaneacionEstrategica(this.idFormulario!, this.f['mision'].value, this.f['vision'].value, this.objetivos)
      .subscribe({
        next: (resp: any) => {
          this.objetivos = resp;

          this.objetivos = this.objetivos.filter((x: any) => { return x.peo_borrado == false });

          this.hayCambios = false;
          this.accionesActivas = true;
          this.cargandoGuardado = false;
          this.moduloLibre.emit('1');

          this.snackBar.open('La planeación estratégica fue actualizada exitosamente', 'Cerrar');
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.accionesActivas = true;
          this.cargandoGuardado = false;
          this.moduloLibre.emit('1');
        }
      });
    }
  }

  agregarObjetivo() {
    this.objetivos.push({peo_pk_id: null, peo_objetivo: null, peo_actualizado: false, peo_borrado: false});

    this.hayCambios = true;
    this.formularioCorrecto = false;
  }

  gestionarActulizacionObjetivo(indice: number) {
    if (this.objetivos[indice].peo_pk_id !== null) {
      this.objetivos[indice].peo_actualizado = true;
    }
  }

  borrarObjetivo(indice: number) {
    if (this.objetivos[indice].peo_pk_id === null) {
      this.objetivos.splice(indice, 1);
    } else {
      this.objetivos[indice].peo_borrado = true;
    }

    this.revisarFormulario();
  }

  restaurarObjetivo(indice: number) {
    this.objetivos[indice].peo_borrado = false;
    this.revisarFormulario();
  }

  revisarFormulario() {
    this.hayCambios = true;

    if (this.formulario.valid) {
      if (this.objetivos.length > 0) {
        let objetivosSBorrados = 0;

        for (const obj of this.objetivos) {
          if (obj.peo_objetivo === null || obj.peo_objetivo.trim() === '') {
            this.objetivosCorrectos = false;
            this.formularioCorrecto = false;
            return;
          }

          if (obj.peo_borrado) {
            objetivosSBorrados++;
          }
        }

        if (objetivosSBorrados === this.objetivos.length) {
          this.objetivosCorrectos = false;
          this.formularioCorrecto = false;
          return;
        }
      } else {
        this.objetivosCorrectos = false;
        this.formularioCorrecto = false;
        return;
      }

      this.objetivosCorrectos = true;
      this.formularioCorrecto = true;
    } else {
      this.formularioCorrecto = false;
    }
  }
}
