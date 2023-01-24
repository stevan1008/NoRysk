import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccesoService } from '../services/acceso.service';
import { Desencriptor } from '../util/seguridad/Desencriptor';
import { Encriptor } from '../util/seguridad/Encriptor';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-area-trabajo',
  templateUrl: './area-trabajo.component.html',
  styleUrls: ['./area-trabajo.component.css']
})
export class AreaTrabajoComponent implements OnInit, OnDestroy {

  private encriptor: Encriptor;
  private desencriptor: Desencriptor;

  public nombreUsuario: string;
  public rolUsuario: number | undefined;

  public idIntToken: number;

  constructor(private accesoService: AccesoService,
              private snackBar: MatSnackBar,
              private router: Router) {
    this.accesoService.actualizarJWTHeaders();

    this.encriptor = new Encriptor();
    this.desencriptor = new Desencriptor();

    this.rolUsuario = 0;
    this.nombreUsuario = '';

    this.idIntToken = 0;

    this.desencriptor.setTexto(sessionStorage.getItem('rol_usuario')!);
    this.rolUsuario = +this.desencriptor.desencriptar();

    this.desencriptor.setTexto(sessionStorage.getItem('nombre_usuario')!);
    this.nombreUsuario = this.desencriptor.desencriptar();
  }

  ngOnInit(): void {
    this.verificarTokenUsuarioPeriodico();
  }

  ngOnDestroy(): void {
    window.clearInterval(this.idIntToken);
  }

  public verificarTokenUsuarioPeriodico() {
    this.idIntToken = window.setInterval(() => {
      this.desencriptor.setTexto(sessionStorage.getItem('token')!);
      const jwt: any = JSON.parse(this.desencriptor.desencriptar());
      const access_token: any = jwt_decode(jwt.access_token);

      if (this.rolUsuario === 1) {
        this.accesoService.verificarTokenAdministrador(access_token.jti)
        .subscribe({
          error: (e: any) => {
            if (+e.status === 401) { // No autorizado
              window.clearInterval(this.idIntToken);

              this.accesoService.cerrarSesion();
              this.router.navigate(['app/acceso']);

              this.snackBar.open('No fue posible validar su sesión. Por favor acceda nuevamente.', 'Cerrar', {duration: 5000});
            }
          }
        });
      } else {
        this.accesoService.verificarTokenUsuario(access_token.jti)
        .subscribe({
          error: (e: any) => {
            if (+e.status === 401) { // No autorizado
              window.clearInterval(this.idIntToken);

              this.accesoService.cerrarSesion();
              this.router.navigate(['app/acceso']);

              this.snackBar.open('No fue posible validar su sesión. Por favor acceda nuevamente.', 'Cerrar', {duration: 5000});
            }
          }
        });
      }
    }, 5000);

    this.encriptor.setTexto(this.idIntToken.toString());
    sessionStorage.setItem('idIntToken', this.encriptor.encriptar());
  }
}

