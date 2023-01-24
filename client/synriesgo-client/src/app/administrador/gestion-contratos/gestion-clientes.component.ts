import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientesService } from 'src/app/services/clientes.service';
import { ErrorConexionComponent } from 'src/app/util/errorConexion/errorConexion.component';
import { WindowScroll } from 'src/app/util/helpers/windowScroll';

@Component({
  selector: 'app-gestion-contratos',
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.css']
})
export class GestionClientesComponent implements OnInit {
  @Output() moduloLibre = new EventEmitter();
  @Output() moduloCargando = new EventEmitter();

  public formulario: FormGroup;

  public clientes: any;
  public idCliente: string;

  public filtroDepartamentos: any;
  public filtroMunicipios: any;

  public departamentos: any;
  public municipiosOriginal: any;
  public municipios: any;

  public accionesActivas: boolean;
  public hayCambios: boolean;
  public indiceActualizacion: string;

  public rerender: boolean;

  public cargando: boolean;
  public cargandoIdentificador: boolean;
  public cargandoFormulario: boolean;

  // Opciones para Datatables de JQuery
  opcionesTabla: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    order: [[ 0, 'asc' ]],
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
    }
  };

  @ViewChild(ErrorConexionComponent, {static: false}) errorConexion: ErrorConexionComponent | undefined;

  constructor(private clientesService: ClientesService,
              private snackBar: MatSnackBar,
              public scroll: WindowScroll) {
    this.clientesService.actualizarJWTHeaders();

    this.accionesActivas = true;
    this.hayCambios = false;
    this.rerender = false;

    this.cargando = true;
    this.cargandoIdentificador = false;
    this.cargandoFormulario = false;

    this.idCliente = '0';
    this.indiceActualizacion = '';

    this.departamentos = require('src/app/util/auxiliaresBaseDeDatos/departamentos.json');
    this.municipiosOriginal = require('src/app/util/auxiliaresBaseDeDatos/municipios.json');

    this.formulario = new FormGroup({
      razonSocial: new FormControl(null,Validators.required),
      representanteLegal: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.pattern('^([a-zA-ZñÑ0-9._-]*)([@]{1})([a-zA-ZñÑ0-9_.-]{1,})$')]),
      direccion: new FormControl(null, Validators.required),
      departamento: new FormControl(null, Validators.required),
      ciudad: new FormControl(null, Validators.required),
      fechaInicio: new FormControl(null, Validators.required),
      fechaFin: new FormControl(null, Validators.required),
      numeroSedes: new FormControl(null, Validators.required),
    });

    this.formulario.valueChanges.subscribe({next: () => { this.hayCambios = true }});

    this.clientes = [];
    this.municipios = [];

    this.filtroDepartamentos = this.departamentos.slice();

    this.clientesService.obtenerClientes()
    .subscribe({
      next: (resp: any) => {
        this.clientes = resp;
        this.rerender = true;

        setTimeout(() => {
          this.moduloLibre.emit('0');
          this.cargando = false;
        }, 500);
      },
      error: (e: any) => {
        console.log(e);
        this.errorConexion?.activarErrorConexion();
        this.moduloLibre.emit('0');
        this.cargando = false;
      }
    });
  }

  get f() {
    return this.formulario.controls;
  }

  ngOnInit(): void {
    this.departamentos.sort(function(a: any, b: any) {
      return a.dep_nombre > b.dep_nombre ? 1 : -1;
    });
  }

  private gestionarActivacionFormulario(estado: boolean) {
    for (const ctrl in this.formulario.controls) {
      if (!estado) {
        this.formulario.controls[ctrl].disable();
      } else {
        this.formulario.controls[ctrl].enable();
      }
    }
  }

  onSubmit() {
    if (this.formulario.valid && this.accionesActivas) {
      this.gestionarActivacionFormulario(false);
      this.accionesActivas = false;
      this.cargandoFormulario = true;
      this.moduloCargando.emit('0');

      const datos = {
        cli_razon_social: this.f['razonSocial'].value,
        cli_rep_legal: this.f['representanteLegal'].value,
        cli_email: this.f['email'].value,
        cli_direccion: this.f['direccion'].value,
        dep_fk_id: this.f['departamento'].value,
        mun_fk_id: this.f['ciudad'].value,
        cli_fecha_inicio: this.f['fechaInicio'].value,
        cli_fecha_fin: this.f['fechaFin'].value,
        cli_numero_sedes: this.f['numeroSedes'].value
      };

      this.rerender = false;
      this.cargando = true;

      this.clientesService.crearCliente(datos)
      .subscribe({
        next: (resp: any) => {
          this.idCliente = resp.response;

          this.clientes.push(datos);
          this.clientes[this.clientes.length - 1].cli_pk_id = this.idCliente;

          const hoy = new Date();
          hoy.setHours(0);
          hoy.setMinutes(0);
          hoy.setSeconds(0);
          hoy.setMilliseconds(0);

          const fechaFin = new Date(this.f['fechaFin'].value);
          fechaFin.setMinutes(fechaFin.getMinutes() + fechaFin.getTimezoneOffset());

          this.clientes[this.clientes.length - 1].activo = (hoy <= fechaFin ? true : false);
          this.clientes[this.clientes.length - 1].dias_habiles = (fechaFin.getTime() - hoy.getTime()) / (1000*60*60*24);

          this.gestionarActivacionFormulario(true);
          this.accionesActivas = true;
          this.cargandoFormulario = false;
          this.rerender = true;
          this.cargando = false;
          this.moduloLibre.emit('0');

          this.hayCambios = false;

          this.snackBar.open('El cliente fue creado existosamente', 'Cerrar');
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.gestionarActivacionFormulario(true);
          this.accionesActivas = true;
          this.cargando = false;
          this.cargandoFormulario = false;
          this.moduloLibre.emit('0');
        }
      });
    }
  }

  onUpdate() {
    if (this.formulario.valid && this.accionesActivas && this.hayCambios) {
      this.gestionarActivacionFormulario(false);
      this.accionesActivas = false;
      this.cargandoFormulario = true;
      this.moduloCargando.emit('0');

      const datos = {
        cli_razon_social: this.f['razonSocial'].value,
        cli_rep_legal: this.f['representanteLegal'].value,
        cli_email: this.f['email'].value,
        cli_direccion: this.f['direccion'].value,
        dep_fk_id: this.f['departamento'].value,
        mun_fk_id: this.f['ciudad'].value,
        cli_fecha_inicio: this.f['fechaInicio'].value,
        cli_fecha_fin: this.f['fechaFin'].value,
        cli_numero_sedes: this.f['numeroSedes'].value
      };

      this.clientesService.actualizarCliente(this.idCliente, datos)
      .subscribe({
        next: () => {
          const hoy = new Date();
          hoy.setHours(0);
          hoy.setMinutes(0);
          hoy.setSeconds(0);
          hoy.setMilliseconds(0);

          const fechaFin = new Date(this.f['fechaFin'].value);
          fechaFin.setMinutes(fechaFin.getMinutes() + fechaFin.getTimezoneOffset());

          this.clientes[this.indiceActualizacion].activo = (hoy <= fechaFin ? true : false);
          this.clientes[this.indiceActualizacion].dias_habiles = (fechaFin.getTime() - hoy.getTime()) / (1000*60*60*24);

          this.clientes[this.indiceActualizacion].cli_razon_social = this.f['razonSocial'].value;
          this.clientes[this.indiceActualizacion].cli_rep_legal = this.f['representanteLegal'].value;
          this.clientes[this.indiceActualizacion].cli_email = this.f['email'].value;
          this.clientes[this.indiceActualizacion].cli_direccion = this.f['direccion'].value;
          this.clientes[this.indiceActualizacion].dep_fk_id = this.f['departamento'].value;
          this.clientes[this.indiceActualizacion].mun_fk_id = this.f['ciudad'].value;
          this.clientes[this.indiceActualizacion].cli_fecha_inicio = this.f['fechaInicio'].value;
          this.clientes[this.indiceActualizacion].cli_fecha_fin = this.f['fechaFin'].value;
          this.clientes[this.indiceActualizacion].cli_numero_sedes = this.f['numeroSedes'].value;

          this.gestionarActivacionFormulario(true);
          this.accionesActivas = true;
          this.cargandoFormulario = false;
          this.rerender = true;
          this.cargando = false;
          this.moduloLibre.emit('0');

          this.hayCambios = false;

          this.snackBar.open('El cliente fue actualizado existosamente', 'Cerrar');
        },
        error: (e) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.gestionarActivacionFormulario(true);
          this.accionesActivas = true;
          this.cargandoFormulario = false;
          this.moduloLibre.emit('0');
        }
      });
    }
  }

  verificarExistenciaIdentificador() {
    if (this.f['idCliente'].value !== null && this.f['idCliente'].value.trim() !== '') {
      this.cargandoIdentificador = true;
      this.f['idCliente'].disable();
      this.moduloCargando.emit('0');

      this.clientesService.verificarExistenciaIdentificador(this.f['idCliente'].value.trim())
      .subscribe({
        next: (resp: any) => {
          if (+resp > 0) {
            this.f['idCliente'].setValue('');
            this.snackBar.open('El identificador del cliente ya existe', 'Cerrar');
          }

          this.f['idCliente'].enable();
          this.cargandoIdentificador = false;
          this.moduloLibre.emit('0');
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.f['idCliente'].enable();
          this.f['idCliente'].setValue('');
          this.cargandoIdentificador = false;
          this.moduloLibre.emit('0');
        }
      });
    }
  }

  getMunicipios() {
    this.municipios = [];
    if (this.f['departamento'].value !== null && +this.f['departamento'].value !== 0) {
      this.municipios = this.municipiosOriginal.filter((x: any) => +x.dep_fk_id === +this.f['departamento'].value);

      this.municipios.sort(function(a: any, b: any) {
        return a.mun_nombre > b.mun_nombre ? 1 : -1;
      });

      this.filtroMunicipios = this.municipios.slice();
    }
  }

  prepararActualizacion(reg: any, indice: number) {
    this.idCliente = reg.cli_pk_id;
    this.indiceActualizacion = indice.toString();

    this.f['razonSocial'].setValue(reg.cli_razon_social);
    this.f['representanteLegal'].setValue(reg.cli_rep_legal);
    this.f['email'].setValue(reg.cli_email);
    this.f['direccion'].setValue(reg.cli_direccion);
    this.f['departamento'].setValue(reg.dep_fk_id.toString());
    this.getMunicipios();
    this.f['ciudad'].setValue(reg.mun_fk_id.toString());
    this.f['fechaInicio'].setValue(reg.cli_fecha_inicio);
    this.f['fechaFin'].setValue(reg.cli_fecha_fin);
    this.f['numeroSedes'].setValue(reg.cli_numero_sedes);

    this.hayCambios = false;
    this.scroll.scrollToTop();
  }

  gestionarFechaInicio() {
    if (this.f['fechaInicio'].value !== null && this.f['fechaFin'].value !== null) {
      const fechaInicio = new Date(this.f['fechaInicio'].value);
      const fechaFin = new Date(this.f['fechaFin'].value);

      if (fechaInicio > fechaFin) {
        this.f['fechaInicio'].setValue(null);
        this.snackBar.open('La fecha de inicio no puede ser mayor a la fecha de fin', 'Cerrar');
      }
    }
  }

  gestionarFechaFin() {
    if (this.f['fechaInicio'].value !== null && this.f['fechaFin'].value !== null) {
      const fechaInicio = new Date(this.f['fechaInicio'].value);
      const fechaFin = new Date(this.f['fechaFin'].value);

      if (fechaFin < fechaInicio) {
        this.f['fechaFin'].setValue(null);
        this.snackBar.open('La fecha de fin no puede ser menor a la fecha de inicio', 'Cerrar');
      }
    }
  }

  limpiarFomrulario() {
    this.idCliente = '0';

    this.f['razonSocial'].setValue('');
    this.f['representanteLegal'].setValue('');
    this.f['email'].setValue('');
    this.f['direccion'].setValue('');
    this.f['departamento'].setValue(null);
    this.f['ciudad'].setValue(null);
    this.f['fechaInicio'].setValue(null);
    this.f['fechaFin'].setValue(null);
    this.f['numeroSedes'].setValue(null);
  }
}
