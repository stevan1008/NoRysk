import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Desencriptor } from '../util/seguridad/Desencriptor';
import { Encriptor } from '../util/seguridad/Encriptor';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private headers: any;
  private headersPwd: any;
  private encriptor: Encriptor;
  private desencriptor: Desencriptor;

  private urlGetTokenUsuario = environment.laravelApi + '/oauth/token';
  private urlVerificarAccesoUsuario = environment.laravelApi + '/usuarios/verificarAccesoUsuario';
  private urlVerificarTokenAdministrador = environment.laravelApi + '/usuarios/verificarTokenAccesoAdministrador';
  private urlVerificarTokenUsuario = environment.laravelApi + '/usuarios/verificarTokenAccesoUsuario';
  private urlRevocarTokenUsuario = environment.laravelApi + '/usuarios/revocarTokenAccesoUsuario';
  private urlObtenerUsuarioResponsableEntidad = environment.laravelApi + '/administrador/usuarios/obtenerUsuarioResponsableEntidad';
  private urlVerificarExistenciaCorreo = environment.laravelApi + '/usuarios/verificarExistenciaCorreoElectronico';
  private urlCrearUsuario = environment.laravelApi + '/usuarios/registrarUsuario';
  private urlActualizarUsuarioAdministrador = environment.laravelApi + '/administrador/usuarios/actualizarUsuario';
  private urlReenviarCorreoVerificacion = environment.laravelApi + '/usuarios/reenviarVerificacionCorreo';
  private urlInhabilitarUsuario = environment.laravelApi + '/usuarios/inhabilitarUsuario';
  private urlEnviarRecuperacionContrasena = environment.laravelApi + '/usuarios/enviarRecuperacionContrasena';

  constructor(private http: HttpClient) {
    this.encriptor = new Encriptor();
    this.desencriptor = new Desencriptor();
  }

  public actualizarJWTHeaders() {
    this.desencriptor.setTexto(sessionStorage.getItem('token')!);

    try {
      let jwt: any = JSON.parse(this.desencriptor.desencriptar());

      this.headers = new HttpHeaders(
        {
          'Accept': 'application/json',
          'Authorization': `Bearer ${jwt.access_token}`
        }
      );
    } catch {
      this.headers = null;
    }
  }

  public actualizarPwdHeaders() {
    this.headersPwd = new HttpHeaders(
      {
        'Accept': 'application/json',
        'Authorization': `Bearer ${environment.OAuthPassworResetToken.token}`
      }
    );
  }

  public getTokenUsuario(usuario: string, contrasena: string) {
    const apiConfig = environment.OAuthPasswordGrantClient;

    const datos = {
      grant_type: 'password',
      client_id: apiConfig.id,
      client_secret: apiConfig.secret,
      username: usuario,
      password: contrasena,
      scope: 'api'
    };

    return this.http.post(this.urlGetTokenUsuario, datos);
  }

  public verificarTokenAdministrador(jwt: string) {
    return this.http.get(this.urlVerificarTokenAdministrador + '/' + jwt, {headers: this.headers});
  }

  public verificarTokenUsuario(jwt: string) {
    return this.http.get(this.urlVerificarTokenUsuario + '/' + jwt, {headers: this.headers});
  }

  public verificarAccesoUsuario(email: string) {
    return this.http.post(this.urlVerificarAccesoUsuario, {email}, {headers: this.headers});
  }

  public almacenarSesion(usuario: any) {
    if (usuario.cli_fk_id !== null) {
      this.encriptor.setTexto(usuario.cli_fk_id.toString());
      sessionStorage.setItem('id_cliente', this.encriptor.encriptar());
    }

    this.encriptor.setTexto(usuario.id.toString());
    sessionStorage.setItem('id_usuario', this.encriptor.encriptar());

    this.encriptor.setTexto(usuario.name.toString());
    sessionStorage.setItem('nombre_usuario', this.encriptor.encriptar());

    this.encriptor.setTexto(usuario.rol_fk_id.toString());
    sessionStorage.setItem('rol_usuario', this.encriptor.encriptar());

    this.encriptor.setTexto(usuario.email.toString());
    sessionStorage.setItem('correo_usuario', this.encriptor.encriptar());
  }

  public revocarTokenUsuario() {
    return this.http.delete(this.urlRevocarTokenUsuario, {headers: this.headers});
  }

  public cerrarSesionRevocandoToken() {
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('id_cliente');
      sessionStorage.removeItem('id_usuario');
      sessionStorage.removeItem('nombre_usuario');
      sessionStorage.removeItem('rol_usuario');
      sessionStorage.removeItem('correo_usuario');
      sessionStorage.removeItem('idIntToken');
    } catch {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('id_cliente');
      sessionStorage.removeItem('id_usuario');
      sessionStorage.removeItem('nombre_usuario');
      sessionStorage.removeItem('rol_usuario');
      sessionStorage.removeItem('correo_usuario');
      sessionStorage.removeItem('idIntToken');
    }

    return this.revocarTokenUsuario()
    .subscribe({
      next: (response: any) => {
        this.actualizarJWTHeaders();
      },
      error: (e: any) => {
        console.log(e);
      }
    });
  }

  public cerrarSesion() {
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('id_cliente');
      sessionStorage.removeItem('id_usuario');
      sessionStorage.removeItem('nombre_usuario');
      sessionStorage.removeItem('rol_usuario');
      sessionStorage.removeItem('correo_usuario');
      sessionStorage.removeItem('idIntToken');
    } catch {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('id_cliente');
      sessionStorage.removeItem('id_usuario');
      sessionStorage.removeItem('nombre_usuario');
      sessionStorage.removeItem('rol_usuario');
      sessionStorage.removeItem('correo_usuario');
      sessionStorage.removeItem('idIntToken');
    }

    this.revocarTokenUsuario()
    .subscribe({
      next: (response: any) => {
        this.actualizarJWTHeaders();
      },
      error: (e: any) => {
        console.log(e);
      }
    });
  }

  public obtenerUsuarioResponsableEntidad(cliente: string) {
    return this.http.get(this.urlObtenerUsuarioResponsableEntidad + '/' + cliente, {headers: this.headers});
  }

  public verificarExistenciaCorreo(email: string) {
    return this.http.post(this.urlVerificarExistenciaCorreo, {email}, {headers: this.headers});
  }

  public registrarUsuario(cliente: string, nombre: string, correo: string, rol: number, tipoDocumento: string, documento: string,
                          contrasena: string, administrador: boolean = false) {
    const datos = {
      cli_fk_id: cliente,
      name: nombre,
      email: correo,
      rol_fk_id: rol,
      tdo_fk_id: tipoDocumento,
      usu_documento: documento,
      password: contrasena,
      password_confirmation: contrasena,
      administrador
    };

    return this.http.post(this.urlCrearUsuario, datos, {headers: this.headers});
  }

  public actualizarUsuarioAdministrador(idUsuario: string, email, nombre: string, tipoDocumento: string, documento: string, contrasena: string) {
    const datos = {
      email,
      name: nombre,
      tdo_fk_id: tipoDocumento,
      usu_documento: documento,
      password: contrasena
    };

    return this.http.put(this.urlActualizarUsuarioAdministrador + '/' + idUsuario, datos, {headers: this.headers});
  }

  public reenviarCorreoVerificacion(id: string) {
    return this.http.put(this.urlReenviarCorreoVerificacion + '/' + id, {}, {headers: this.headers});
  }

  public inhabilitarUsuario(id: string) {
    return this.http.delete(this.urlInhabilitarUsuario + '/' + id, {headers: this.headers});
  }

  public enviarRecuperacionContrasena(correo: string) {
    return this.http.put(this.urlEnviarRecuperacionContrasena + '/' + correo, {}, {headers: this.headersPwd});
  }
}
