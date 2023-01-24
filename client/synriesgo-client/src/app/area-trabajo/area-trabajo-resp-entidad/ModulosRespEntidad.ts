export class ModulosRespEntidad {
  private modulos: any = [];

  constructor() {
    this.modulos.push(
      {
        id: 0,
        nombre: 'Gestión de usuarios',
        icono: 'fa-solid fa-users',
        imagen: 'gestionUsuarios.jpg',
        descripcion: 'Cree o gestione o los usuarios que harán uso del aplicativo.',
        cargando: false
      }
    );

    this.modulos.push(
      {
        id: 1,
        nombre: 'Planeación estratégica',
        icono: 'fa-solid fa-sheet-plastic',
        imagen: 'planeacionEstrategica.jpg',
        descripcion: 'Defina la misión, visión y objetivos de la compañía.',
        cargando: false
      }
    );

    this.modulos.push(
      {
        id: 2,
        nombre: 'Mapa de procesos',
        icono: 'fa-solid fa-gears',
        imagen: 'mapaProcesos.jpg',
        descripcion: 'Establezca los macroprocesos, procesos y subprocesos.',
        cargando: false
      }
    );

    this.modulos.push(
      {
        id: 3,
        nombre: 'Gestión de sedes',
        icono: 'fa-solid fa-building',
        imagen: 'gestionSedes.jpg',
        descripcion: 'Cree o gestione las sedes que operan en su compañía.',
        cargando: false
      }
    );

    this.modulos.push(
      {
        id: 4,
        nombre: 'Procesos e indicadores',
        icono: 'fa-solid fa-chart-line',
        imagen: 'procesosIndicadores.jpg',
        descripcion: 'Defina los procesos de su compañía y los indicadores que los evalúan.',
        cargando: false
      }
    );
  }

  public getModulos() {
    return this.modulos;
  }
}