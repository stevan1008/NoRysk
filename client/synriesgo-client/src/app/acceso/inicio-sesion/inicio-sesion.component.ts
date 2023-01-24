import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/services/acceso.service';
import { ErrorConexionComponent } from 'src/app/util/errorConexion/errorConexion.component';
import { PantallaEsperaComponent } from 'src/app/util/pantallaEspera/pantallaEspera.component';
import { Encriptor } from 'src/app/util/seguridad/Encriptor';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {

  private randomString = require('@smakss/random-string');

  public formulario: FormGroup;
  public formularioRec: FormGroup;
  private encriptor: Encriptor;

  public captcha: string;
  public mostrarCaptcha: boolean;
  public cargando: boolean;

  @ViewChild(ErrorConexionComponent, {static: false}) errorConexion: ErrorConexionComponent | undefined;

  constructor(private accesoService: AccesoService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.accesoService.actualizarPwdHeaders();

    this.encriptor = new Encriptor();

    this.captcha = '';
    this.mostrarCaptcha = false;
    this.cargando = false;

    this.formulario = new FormGroup(
      {
        correo: new FormControl(null, [Validators.required, Validators.email]),
        contrasena: new FormControl(null, Validators.required),
        captcha: new FormControl(null, Validators.required)
      }
    );

    this.formularioRec = new FormGroup(
      {
        correoRecuperacion: new FormControl(null, [Validators.required, Validators.email]),
        captcha2: new FormControl(null, Validators.required)
      }
    );

    this.refrescarCaptcha();
  }

  get f() { return this.formulario.controls; }
  get f2() { return this.formularioRec.controls; }

  ngOnInit(): void {
    this.generarCaptcha();
  }

  public validarUsuario() {
    if (this.formulario.valid && this.captcha === this.f['captcha'].value) {
      const contrasena = this.f['contrasena'].value;
      this.f['contrasena'].setValue('');

      this.cargando = true;

      this.accesoService.getTokenUsuario(this.f['correo'].value.trim(), contrasena)
      .subscribe({
        next: (response: any) => {
          this.encriptor.setTexto(JSON.stringify(response));
          sessionStorage.setItem('token', this.encriptor.encriptar());
          this.accesoService.actualizarJWTHeaders();

          this.accesoService.verificarAccesoUsuario(this.f['correo'].value)
          .subscribe({
            next: (response2: any) => {
              const serverResponse: any = response2;

              if (serverResponse.valid) {
                this.accesoService.almacenarSesion(serverResponse.user);
                //this.activarPantallCompleta();

                setTimeout(() => {
                  this.router.navigate(['/app']);
                });
              } else {
                this.accesoService.cerrarSesionRevocandoToken().add(() => {
                  this.cargando = false;
                  this.snackBar.open('El usuario no cumple las condiciones para iniciar sesión', 'Cerrar');

                  this.gestionarMostrarCredenciales();
                  this.refrescarCaptcha();

                  setTimeout(() => {
                    var canvas: any = document.getElementById("captcha")!;
                    var ctx = canvas.getContext("2d");
                    ctx.font = "33px consolas";
                    ctx.fillText(this.captcha, 55, 35);
                  });
                });
              }
            },
            error: (e: any) => {
              this.cargando = false;
              this.errorConexion?.activarErrorConexion();

              this.gestionarMostrarCredenciales();
              this.refrescarCaptcha();
              this.generarCaptcha();
            }
          });
        },
        error: (e: any) => {
          this.f['contrasena'].setValue('');
          this.cargando = false;

          if (+e.status === 400) { // Credenciales incorrectas
            this.snackBar.open('Las credenciales no son correctas', 'Cerrar');
          } else if (+e.status === 401) { // No autorizado
            this.snackBar.open('Acceso no autorizado. Por favor contacte al administrador', 'Cerrar');
          } else if (+e.status === 0 || +e.status === 500) { // Sin conexión al servidor
            this.snackBar.open('No fue posible iniciar su sesión. Credenciales incorrectas o problemas contactando el servidor.', 'Cerrar');
          } else {
            this.snackBar.open('No fue posible iniciar su sesión. Por favor contacte al administrador', 'Cerrar');
          }

          this.gestionarMostrarCredenciales();
          this.refrescarCaptcha();
          this.generarCaptcha();
        }
      });
    }
  }

  public recuperarContrasena() {
    if (this.formularioRec.valid && this.captcha === this.f2['captcha2'].value) {
      this.cargando = true;

      this.accesoService.enviarRecuperacionContrasena(this.f2['correoRecuperacion'].value)
      .subscribe({
        next: () => {
          this.f2['correoRecuperacion'].setValue(null);
          this.f2['captcha2'].setValue(null);

          this.refrescarCaptcha();
          this.generarCaptcha();

          this.cargando = false;
          this.snackBar.open('El correo de recuperación fue enviado', 'Cerrar');
        },
        error: (e: any) => {
          console.log(e);
          this.errorConexion?.activarErrorConexion();
          this.f2['correoRecuperacion'].setValue(null);
          this.f2['captcha2'].setValue(null);
          this.refrescarCaptcha();
          this.generarCaptcha();
          this.cargando = false;
        }
      });
    }
  }

  public gestionarMostrarCredenciales() {
    this.mostrarCaptcha = false;
  }

  public gestionarMostrarCaptcha() {
    this.refrescarCaptcha();
    this.generarCaptcha();

    this.mostrarCaptcha = true;
  }

  private refrescarCaptcha() {
    this.captcha = this.randomString(7, 'Xa8Tbc6DdeGfgHhj5knpAqr7stu2vNPwxyQzBCE34FJiL9MRSoUVWYZmK');
    this.f['captcha'].setValue('');
  }

  private generarCaptcha() {
    setTimeout(() => {
      var canvas: any = document.getElementById("captcha")!;
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "33px consolas";
      ctx.fillText(this.captcha, 15, 35);

      var canvas2: any = document.getElementById("captcha2")!;
      var ctx2 = canvas2.getContext("2d");
      ctx2.clearRect(0, 0, canvas.width, canvas.height);
      ctx2.font = "33px consolas";
      ctx2.fillText(this.captcha, 15, 35);
    });
  }

  private activarPantallCompleta() {
    var app_root = (document.getElementById("app-root") as any);

    if (app_root.requestFullscreen) {
      app_root.requestFullscreen();
    } else if (app_root.webkitRequestFullscreen) { /* Safari */
      app_root.webkitRequestFullscreen();
    } else if (app_root.msRequestFullscreen) { /* IE11 */
      app_root.msRequestFullscreen();
    }
  }
}
