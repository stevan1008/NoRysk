import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AreaTrabajoComponent } from './area-trabajo.component';

import { AreaTrabajoAdministradorComponent } from './area-trabajo-administrador/area-trabajo-administrador.component';
import { GestionClientesModule } from '../administrador/gestion-contratos/gestion-clientes.module';
import { GestionUsuariosModule } from '../administrador/gestion-usuarios/gestion-usuarios.module';
import { GestionRiesgoModule } from '../administrador/gestion-riesgo/gestion-riesgo.module';
import { ControlRiesgoModule } from '../administrador/control-riesgo/control-riesgo.module';

import { AreaTrabajoRespEntidadComponent } from './area-trabajo-resp-entidad/area-trabajo-resp-entidad.component';

import { PlaneacionEstrategicaModule } from '../parametros/planeacion-estrategica/planeacion-estrategica.module';
import { MapaProcesosModule } from '../parametros/mapa-procesos/mapa-procesos.module';
import { IndicadoresModule } from '../parametros/indicadores/inidicadores.module';
import { GestionSedesModule } from '../parametros/gestion-sedes/gestion-sedes.module';

@NgModule({
  declarations: [
    AreaTrabajoComponent,
    AreaTrabajoAdministradorComponent,
    AreaTrabajoRespEntidadComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,

    /* Administador */
    GestionClientesModule,
    GestionUsuariosModule,

    /* Parametros */
    PlaneacionEstrategicaModule,
    MapaProcesosModule,
    GestionSedesModule,
    IndicadoresModule,

    /* Gestion del riesgo */
    GestionRiesgoModule,
    ControlRiesgoModule
  ],
  exports: [
    AreaTrabajoAdministradorComponent
  ]
})
export class AreaTrabajoModule { }
