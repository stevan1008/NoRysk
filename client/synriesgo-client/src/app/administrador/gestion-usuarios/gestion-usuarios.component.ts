import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccesoService } from 'src/app/services/acceso.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { ErrorConexionComponent } from 'src/app/util/errorConexion/errorConexion.component';
import { SecurePasswordGenerator } from 'src/app/util/seguridad/SecurePasswordGenerator';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {
  @Output() moduloLibre = new EventEmitter();
  @Output() moduloCargando = new EventEmitter();

  public formulario: FormGroup;

  public clientes: any;
  public filtroClientes: any;

  public accionesActivas: boolean;
  public hayCambios: boolean;

  public tiposDocumento: any;

  public idUsuario: string;
  public activacionUsuario: boolean | null;

  public rerenderCli: boolean;
  public cargandoCli: boolean;
  public cargandoUsu: boolean;
  public cargandoCorreo: boolean;
  public cargandoEmail: boolean;
  public cargandoFormulario: boolean;
  public cargandoBorrado: boolean;

  public confirmacionInhabilitacion: boolean;

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

  constructor(private accesoService: AccesoService,
              private clientesService: ClientesService,
              private snackBar: MatSnackBar) {
    this.accesoService.actualizarJWTHeaders();
    this.clientesService.actualizarJWTHeaders();

    this.accionesActivas = true;
    this.hayCambios = false;
    this.rerenderCli = false;

    this.cargandoCli = true;
    this.cargandoUsu = false;
    this.cargandoCorreo = false;
    this.cargandoEmail = false;
    this.cargandoFormulario = false;
    this.cargandoBorrado = false;

    this.confirmacionInhabilitacion = false;

    this.clientes = [];

    this.idUsuario = '';
    this.activacionUsuario = null;

    this.tiposDocumento = require('src/app/util/auxiliaresBaseDeDatos/tiposDocumento.json');

    this.formulario = new FormGroup({
      cliente: new FormControl(null, [Validators.required, Validators.min(1)]),
      email: new FormControl(null, [Validators.required, Validators.pattern('^([a-zA-ZñÑ0-9._-]*)([@]{1})([a-zA-ZñÑ0-9_.-]{1,})$')]),
      nombre: new FormControl(null, Validators.required),
      tipoDocumento: new FormControl(null, [Validators.required, Validators.min(1)]),
      documento: new FormControl(null, Validators.required),
    });

    this.formulario.valueChanges.subscribe({next: () => { this.hayCambios = true }});

    this.obtenerClientes().add(() => {
      setTimeout(() => {
        this.cargandoCli = false;
        this.moduloLibre.emit('1');
      }, 500);
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.formulario.controls;
  }

  setValoresDefecto() {
    this.idUsuario = '';
    this.activacionUsuario = null;

    this.f['email'].setValue(null);
    this.f['nombre'].setValue(null);
    this.f['tipoDocumento'].setValue(null);
    this.f['documento'].setValue(null);
  }

  onSubmit() {
    if (this.accionesActivas && this.formulario.valid) {
      this.accionesActivas = false;
      this.cargandoFormulario = true;
      this.moduloCargando.emit('1');

      this.accesoService.registrarUsuario(this.f['cliente'].value,
                                          this.f['nombre'].value,
                                          this.f['email'].value,
                                          2,
                                          this.f['tipoDocumento'].value,
                                          this.f['documento'].value,
                                          new SecurePasswordGenerator().getSecurePassword(),
                                          true)
      .subscribe({
        next: (resp: any) => {
          this.idUsuario = resp.user.id;

          this.cargandoFormulario = false;
          this.moduloLibre.emit('1');

          this.activacionUsuario = false;
          this.hayCambios = false;
          this.accionesActivas = true;

          this.snackBar.open('El usuario fue creado exitosamente', 'Cerrar');
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.cargandoFormulario = false;
          this.accionesActivas = true;
          this.moduloLibre.emit('1');
        }
      });
    }
  }

  onUpdate() {
    if (this.accionesActivas && this.formulario.valid) {
      this.accionesActivas = false;
      this.cargandoFormulario = true;
      this.moduloCargando.emit('1');

      this.accesoService.actualizarUsuarioAdministrador(this.idUsuario,
                                                        this.f['email'].value,
                                                        this.f['nombre'].value,
                                                        this.f['tipoDocumento'].value,
                                                        this.f['documento'].value,
                                                        new SecurePasswordGenerator().getSecurePassword())
      .subscribe({
        next: (resp: any) => {
          this.activacionUsuario = false;

          this.accionesActivas = true;
          this.hayCambios = false;
          this.accionesActivas = true;

          this.cargandoFormulario = false;
          this.moduloLibre.emit('1');

          this.snackBar.open('El usuario fue actualizado exitosamente', 'Cerrar');
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.cargandoFormulario = false;
          this.accionesActivas = true;
          this.moduloLibre.emit('1');
        }
      });
    }
  }

  onDelete() {
    if (!this.cargandoBorrado) {
      this.cargandoBorrado = true;
      this.moduloCargando.emit('1');

      this.accesoService.inhabilitarUsuario(this.idUsuario)
      .subscribe({
        next: (resp: any) => {
          this.setValoresDefecto();

          this.cargandoBorrado = false;
          this.moduloLibre.emit('1');

          this.snackBar.open('El usuario fue inhabilitado', 'Cerrar');
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.confirmacionInhabilitacion = false;
          this.cargandoBorrado = false;
          this.moduloLibre.emit('1');
        }
      });
    }
  }

  public reenviarCorreoVerificacion() {
    if (!this.cargandoEmail) {
      this.cargandoEmail = true;
      this.moduloCargando.emit('1');

      this.accesoService.reenviarCorreoVerificacion(this.idUsuario)
      .subscribe({
        next: (resp: any) => {
          this.cargandoEmail = false;
          this.moduloLibre.emit('1');

          this.snackBar.open('El correo de verificación fue enviado', 'Cerrar');
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.cargandoEmail = false;
          this.moduloLibre.emit('1');
        }
      });
    }
  }

  public recargarClientes() {
    this.moduloCargando.emit('1');
    this.cargandoCli = true;

    this.obtenerClientes().add(() => {
      this.cargandoCli = false;
      this.moduloLibre.emit('1');
    });
  }

  private obtenerClientes() {
    return this.clientesService.obtenerClientesActivos()
    .subscribe({
      next: (resp: any) => {
        this.clientes = resp;
        this.filtroClientes = this.clientes.slice();
      },
      error: (e: any) => {
        console.log(e);
        this.errorConexion?.activarErrorConexion();
      }
    });
  }

  public gestionarCliente() {
    this.setValoresDefecto();

    this.cargandoUsu = true;
    this.moduloCargando.emit('1');

    this.accesoService.obtenerUsuarioResponsableEntidad(this.f['cliente'].value)
    .subscribe({
      next: (resp: any) => {
        if (resp[0] !== undefined) {
          this.idUsuario = resp[0].id;

          this.f['email'].setValue(resp[0].email);
          this.f['nombre'].setValue(resp[0].name);
          this.f['tipoDocumento'].setValue(resp[0].tdo_fk_id.toString());
          this.f['documento'].setValue(resp[0].usu_documento);

          if (resp[0].email_verified_at !== null) {
            this.activacionUsuario = true;
          } else {
            this.activacionUsuario = false;
          }

          this.hayCambios = false;
        }

        setTimeout(() => {
          this.cargandoUsu = false;
          this.moduloLibre.emit('1');
        }, 250);
      },
      error: (e: any) => {
        console.log(e);
        this.errorConexion?.activarErrorConexion();
        this.cargandoUsu = false;
        this.moduloLibre.emit('1');
      }
    });
  }

  public verificarCorreoElectronico() {
    this.cargandoCorreo = true;
    this.moduloCargando.emit('1');

    if (this.f['email'].value !== null) {
      this.f['email'].setValue(this.f['email'].value.trim());
    }

    this.accesoService.verificarExistenciaCorreo(this.f['email'].value)
    .subscribe({
      next: (resp: any) => {
        if (+resp > 0) {
          this.f['email'].setValue(null);
          this.snackBar.open('El correo ya está asociado a otro usuario', 'Cerrar');
        }

        this.cargandoCorreo = false;
        this.moduloLibre.emit('1');
      },
      error: (e: any) => {
        console.log(e);
        this.errorConexion?.activarErrorConexion();
        this.cargandoCorreo = false;
        this.moduloLibre.emit('1');
      }
    });
  }

  public gestionarConfirmacionInhabilitacion() {
    this.confirmacionInhabilitacion = true;

    setTimeout(() => {
      this.confirmacionInhabilitacion = false;
    }, 3000)
  }
}
