import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Desencriptor } from '../util/seguridad/Desencriptor';

@Injectable({
  providedIn: 'root'
})

export class GestionRiesgoService {

  private headers: any;
  private desencriptor: Desencriptor;

  private urlObtenerGestionRiesgo = environment.laravelApi + '/gestion/gestionRiesgo/obtenerGestionRiesgo';
  private urlCrearGestionRiesgo = environment.laravelApi + '/gestion/gestionRiesgo/crearGestionRiesgo';
  private urlActualizarGestionRiesgo = environment.laravelApi + '/gestion/gestionRiesgo/actualizarGestionRiesgo';

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
  
  obtenerGestionRiesgo() {
    return this.http.get(this.urlObtenerGestionRiesgo, {headers: this.headers});
  }
  
  crearGestionRiesgo(data: any) {
    console.log(data);
    return this.http.post(this.urlCrearGestionRiesgo, data, {headers: this.headers});
  }

  actualizarGestionRiesgo() {
    
  }
}
