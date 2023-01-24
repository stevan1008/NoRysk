import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ModulosRespEntidad } from './ModulosRespEntidad';

@Component({
  selector: 'app-area-trabajo-resp-entidad',
  templateUrl: './area-trabajo-resp-entidad.component.html',
  styleUrls: ['./area-trabajo-resp-entidad.component.css']
})
export class AreaTrabajoRespEntidadComponent implements OnInit {

  @Input() nombreUsuario: string;

  public modulosRespEntidadCompletos: any;
  public modulosRespEntidad: any;
  public modulosRespEntidadPar: any;
  public modulosAbiertos: any = [false, false, false];
  public modulosVisibles: any = [false, false, false];
  public modulosPantDividida: any = [false, false, false];
  public modulosCerrando: any = [false, false, false];
  public modulosTaskbar: any = [null, null, null, null];
  private indiceTaskbar: number;

  public pantallaDividida: boolean;
  public modulosCerrados: boolean;
  public modulosMinimizados: boolean;
  public noModulosVisibles: number;
  public cerrando: boolean;

  // Auxiliares
  public gestionSedesAbierto: boolean;

  constructor() {
    this.pantallaDividida = false;
    this.modulosCerrados = true;
    this.modulosMinimizados = false;
    this.cerrando = false;
    this.indiceTaskbar = 0;
    this.noModulosVisibles = 0;

    this.gestionSedesAbierto = false;

    this.modulosRespEntidadCompletos = new ModulosRespEntidad().getModulos();
    this.modulosRespEntidad = new ModulosRespEntidad().getModulos().filter((x: any) => { return +x.id === 0});
    this.modulosRespEntidadPar = new ModulosRespEntidad().getModulos().filter((x: any) => { return +x.id >= 1});

    this.nombreUsuario = '';
  }

  ngOnInit(): void {
  }

  public abrirModulo(modulo: number) {
    // Verificar si queda espacio en el taskbar
    if (this.indiceTaskbar < 3) {
      for (let i = 0; i < this.modulosVisibles.length; i++) {
        if (!this.pantallaDividida || (this.pantallaDividida && !this.modulosPantDividida[i])) {
          this.modulosVisibles[i] = false;
        }
      }

      if (modulo == 3) {
        this.gestionSedesAbierto = true;
      }

      this.modulosAbiertos[modulo] = true;
      this.modulosVisibles[modulo] = true;
      this.modulosMinimizados = false;
      this.modulosCerrados = false;

      // Modulos visibles
      let noModulosVisibles = 0;

      for (let i = 0; i < this.modulosVisibles.length; i++) {
        noModulosVisibles += (this.modulosVisibles[i] ? 1 : 0);
      }

      this.noModulosVisibles = noModulosVisibles;

      // Pantalla dividida
      if (this.pantallaDividida) {
        this.modulosPantDividida[modulo] = true;
      }

      let abierto = false;

      for (let i = 0; i < this.modulosTaskbar.length; i++) {
        if (this.modulosTaskbar[i] !== null && this.modulosTaskbar[i].id === modulo) {
          abierto = true;
        }
      }

      if (!abierto) {
        this.modulosTaskbar[this.indiceTaskbar] = this.obtenerInformacionModulo(modulo);
        this.modulosTaskbar[this.indiceTaskbar].cargando = true;
        this.indiceTaskbar++;
      }
    }
  }

  public visualizarModulo(modulo: number) {
    for (let i = 0; i < this.modulosVisibles.length; i++) {
      if (!this.pantallaDividida || (this.pantallaDividida && !this.modulosPantDividida[i])) {
        this.modulosVisibles[i] = false;
      }
    }

    this.modulosVisibles[modulo] = true;
    this.modulosPantDividida[modulo] = true;
    this.modulosMinimizados = false;
    this.modulosCerrados = false;

    // Modulos visibles
    let noModulosVisibles = 0;

    for (let i = 0; i < this.modulosVisibles.length; i++) {
      noModulosVisibles += (this.modulosVisibles[i] ? 1 : 0);
    }

    this.noModulosVisibles = noModulosVisibles;
  }

  public minimizarModulo(modulo: number) {
    this.modulosCerrando[modulo] = true;

    let noModulosVisibles = 0;

    for (let i = 0; i < this.modulosVisibles.length; i++) {
      if (modulo !== i) {
        noModulosVisibles += (this.modulosVisibles[i] ? 1 : 0);
      }
    }

    this.noModulosVisibles = noModulosVisibles;

    setTimeout(() => {
      this.pantallaDividida = false;
      this.modulosVisibles[modulo] = false;

      if (noModulosVisibles === 0) {
        this.modulosMinimizados = true;
      }
    }, 400);

    setTimeout(() => {
      this.modulosCerrando[modulo] = false;
    }, 600);
  }

  public habilitarEnPantallDividida(modulo: number) {
    this.pantallaDividida = true;
    this.modulosPantDividida[modulo] = true;
  }

  public deshabilitarEnPantallDividida(modulo: number) {
    this.pantallaDividida = false;

    for (let i = 0; i < this.modulosPantDividida.length; i++) {
      this.modulosPantDividida[i] = false;
    }

    for (let i = 0; i < this.modulosVisibles.length; i++) {
      if (i !== modulo) {
        this.modulosVisibles[i] = false;
      }
    }

    this.noModulosVisibles = 1;
  }

  public cerrarModulo(modulo: number) {
    this.modulosTaskbar = this.modulosTaskbar.filter((x: any) => { return x != null && +x.id !== modulo });
    this.modulosTaskbar.push(null);
    this.indiceTaskbar--;
    this.noModulosVisibles--;

    if (this.indiceTaskbar === 0) {
      this.modulosCerrados = true;
    }

    if (modulo == 3) {
      this.gestionSedesAbierto = false;
    }

    this.cerrando = true;
    this.modulosCerrando[modulo] = true;

    let noModulosVisibles = 0;

    for (let i = 0; i < this.modulosVisibles.length; i++) {
      if (modulo !== i) {
        noModulosVisibles += (this.modulosVisibles[i] ? 1 : 0);
      }
    }

    this.noModulosVisibles = noModulosVisibles;

    setTimeout(() => {
      this.pantallaDividida = false;
      this.modulosPantDividida[modulo] = false;
      this.modulosAbiertos[modulo] = false;
      this.modulosVisibles[modulo] = false;
      this.cerrando = false;

      if (noModulosVisibles === 0) {
        this.modulosMinimizados = true;
      }
    }, 400);

    setTimeout(() => {
      this.modulosCerrando[modulo] = false;
    }, 600);
  }

  private obtenerInformacionModulo(modulo: number) {
    return this.modulosRespEntidadCompletos.filter((x: any) => { return +x.id === modulo })[0];
  }

  public obtenerReglasNgClass(modulo: number) {
    return {
      'col-12': !this.pantallaDividida,
      'col-6': this.pantallaDividida,
      'appear-effect': !this.modulosCerrando[modulo],
      'disappear-effect': this.modulosCerrando[modulo],
      'display-none': !this.modulosVisibles[modulo]
    };
  }

  public activarCargaModulo(modulo: any) {
    const indice = this.modulosTaskbar.findIndex((x: any) => { return +x.id === +modulo });
    this.modulosTaskbar[indice].cargando = true;
  }

  public desactivarCargaModulo(modulo: any) {
    const indice = this.modulosTaskbar.findIndex((x: any) => { return x !== null && +x.id === +modulo });
    this.modulosTaskbar[indice].cargando = false;
  }
}
