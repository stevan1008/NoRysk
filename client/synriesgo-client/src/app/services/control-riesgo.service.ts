import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Desencriptor } from '../util/seguridad/Desencriptor';

@Injectable({
  providedIn: 'root'
})
export class ControlRiesgoService {

  private headers: any;
  private desencriptor: Desencriptor;

  private urlObtenerControlRiesgo = environment.laravelApi + '/control/controlRiesgo/obtenerControlRiesgo';
  private urlCrearControlRiesgo = environment.laravelApi + '/control/controlRiesgo/crearControlRiesgo';
  private urlActualizarControlRiesgo = environment.laravelApi + '/control/controlRiesgo/actualizarControlRiesgo';

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
  
  obtenerControlRiesgo() {
    return this.http.get(this.urlObtenerControlRiesgo, {headers: this.headers});
  }

  crearControlRiesgo(data: any) {
    console.log("Data control: ", data[0]);    
    return this.http.post(this.urlCrearControlRiesgo, data[0], {headers: this.headers});
  }

  actualizarControlRiesgo() {
    
  }

}
