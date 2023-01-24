import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Desencriptor } from '../util/seguridad/Desencriptor';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private headers: any;
  private desencriptor: Desencriptor;

  private urlObtenerClientes = environment.laravelApi + '/administrador/clientes/obtenerClientes';
  private urlObtenerClientesActivos = environment.laravelApi + '/administrador/clientes/obtenerClientesActivos';
  private urlVerificarExistenciaIdentificador = environment.laravelApi + '/clientes/verificarExistenciaIdentificador';
  private urlCrearCliente = environment.laravelApi + '/administrador/clientes/crearCliente';
  private urlActualizarCliente = environment.laravelApi + '/administrador/clientes/actualizarCliente';

  constructor(private http: HttpClient) {
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

  public obtenerClientes() {
    return this.http.get(this.urlObtenerClientes, {headers: this.headers});
  }

  public obtenerClientesActivos() {
    return this.http.get(this.urlObtenerClientesActivos, {headers: this.headers});
  }

  public verificarExistenciaIdentificador(identificador: string) {
    return this.http.get(this.urlVerificarExistenciaIdentificador + '/' + identificador, {headers: this.headers});
  }

  public crearCliente(datos: any) {
    return this.http.post(this.urlCrearCliente, {datos: datos}, {headers: this.headers});
  }

  public actualizarCliente(id: string, datos: any) {
    return this.http.put(this.urlActualizarCliente + '/' + id, {datos: datos}, {headers: this.headers});
  }
}
