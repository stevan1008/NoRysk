import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Desencriptor } from '../util/seguridad/Desencriptor';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  private headers: any;
  private desencriptor: Desencriptor;

  private urlObtenerMisionVision = environment.laravelApi + '/parametros/planeacionEstrategica/obtenerMisionVision';
  private urlObtenerObjetivos = environment.laravelApi + '/parametros/planeacionEstrategica/obtenerObjetivos';
  private urlCrearPlaneacionEstrategica = environment.laravelApi + '/parametros/planeacionEstrategica/crearPlaneacionEstrategica';
  private urlActualizarPlaneacionEstrategica = environment.laravelApi + '/parametros/planeacionEstrategica/actualizarPlaneacionEstrategica';

  private urlObtenerProcesos = environment.laravelApi + '/parametros/planeacionEstrategica/obtenerProcesos';
  private urlObtenerSubprocesos = environment.laravelApi + '/parametros/planeacionEstrategica/obtenerSubprocesos';
  private urlCrearProceso = environment.laravelApi + '/parametros/planeacionEstrategica/crearProceso';
  private urlCrearSubproceso = environment.laravelApi + '/parametros/planeacionEstrategica/crearSubproceso';
  private urlActualizarProceso = environment.laravelApi + '/parametros/planeacionEstrategica/actualizarProceso';
  private urlActualizarSubproceso = environment.laravelApi + '/parametros/planeacionEstrategica/actualizarSubproceso';
  private urlPersistenciaMasivaProcesos = environment.laravelApi + '/parametros/planeacionEstrategica/persistenciaMasivaProcesos';
  private urlPersistenciaMasivaSubprocesos = environment.laravelApi + '/parametros/planeacionEstrategica/persistenciaMasivaSubprocesos';
  private urlBorrarProceso = environment.laravelApi + '/parametros/planeacionEstrategica/borrarProceso';
  private urlBorrarSubproceso = environment.laravelApi + '/parametros/planeacionEstrategica/borrarSubproceso';

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

  public obtenerMisionVision() {
    return this.http.get(this.urlObtenerMisionVision, {headers: this.headers});
  }

  public obtenerObjetivos() {
    return this.http.get(this.urlObtenerObjetivos, {headers: this.headers});
  }

  public crearPlaneacionEstrategica(pes_mision: string, pes_vision: string, objetivos: any) {
    const datos = {pes_mision, pes_vision, objetivos};
    return this.http.post(this.urlCrearPlaneacionEstrategica, datos, {headers: this.headers});
  }

  public actualizarPlaneacionEstrategica(pes_pk_id: string, pes_mision: string, pes_vision: string, objetivos: any) {
    const datos = {pes_mision, pes_vision, objetivos};
    return this.http.put(this.urlActualizarPlaneacionEstrategica + '/' + pes_pk_id, datos, {headers: this.headers});
  }

  public obtenerProcesos() {
    return this.http.get(this.urlObtenerProcesos, {headers: this.headers});
  }

  public obtenerSubprocesos(prc_fk_id: number) {
    return this.http.get(this.urlObtenerSubprocesos + '/' + prc_fk_id, {headers: this.headers});
  }

  public crearProceso(mpc_fk_id: string, prc_nombre: string) {
    const datos = {mpc_fk_id, prc_nombre};
    return this.http.post(this.urlCrearProceso, datos, {headers: this.headers});
  }

  public crearSubproceso(mpc_fk_id: string, prc_fk_id: string, spr_nombre: string) {
    const datos = {mpc_fk_id, prc_fk_id, spr_nombre};
    return this.http.post(this.urlCrearSubproceso, datos, {headers: this.headers});
  }

  public actualizarProceso(prc_pk_id: string, prc_nombre: string) {
    const datos = {prc_nombre};
    return this.http.put(this.urlActualizarProceso + '/' + prc_pk_id, datos, {headers: this.headers});
  }

  public actualizarSubproceso(spr_pk_id: string, spr_nombre: string) {
    const datos = {spr_nombre};
    return this.http.put(this.urlActualizarSubproceso + '/' + spr_pk_id, datos, {headers: this.headers});
  }

  public persistenciaMasivaProcesos(estrategicos: any, misionales: any, apoyo: any, evaluacion: any) {
    const datos = {estrategicos, misionales, apoyo, evaluacion};
    return this.http.post(this.urlPersistenciaMasivaProcesos, datos, {headers: this.headers});
  }

  public persistenciaMasivaSubprocesos(mpc_fk_id: string, prc_fk_id: string, subprocesos: any) {
    const datos = {mpc_fk_id, prc_fk_id, subprocesos};
    return this.http.post(this.urlPersistenciaMasivaSubprocesos, datos, {headers: this.headers});
  }

  public borrarProceso(prc_pk_id: string) {
    return this.http.delete(this.urlBorrarProceso + '/' + prc_pk_id, {headers: this.headers});
  }

  public borrarSubproceso(spr_pk_id: string, prc_fk_id: string) {
    return this.http.delete(this.urlBorrarSubproceso + '/' + spr_pk_id + '/' + prc_fk_id, {headers: this.headers});
  }
}
