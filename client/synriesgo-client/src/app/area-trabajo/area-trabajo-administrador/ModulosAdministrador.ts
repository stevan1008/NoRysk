export class ModulosAdministrador {
  private modulos: any = [];

  constructor() {
    this.modulos.push(
      {
        id: 0,
        nombre: 'Gestión de clientes',
        icono: 'fa-solid fa-file-contract',
        imagen: 'gestionClientes.jpg',
        descripcion: 'Gestione o cree los clientes que van a hacer uso de la plataforma.',
        cargando: false
      }
    );

    this.modulos.push(
      {
        id: 1,
        nombre: 'Gestión de usuarios',
        icono: 'fa-solid fa-users',
        imagen: 'gestionUsuarios.jpg',
        descripcion: 'Gestione o cree los usuarios responsable de cada entidad.',
        cargando: false
      }
    );
  }

  public getModulos() {
    return this.modulos;
  }
}