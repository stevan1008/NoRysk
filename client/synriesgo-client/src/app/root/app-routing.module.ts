import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from '../acceso/inicio-sesion/inicio-sesion.component';
import { AreaTrabajoComponent } from '../area-trabajo/area-trabajo.component';
import { UserAuthGuard } from '../services/guards/UserAuthGuard';
import { IndicadoresComponent } from '../parametros/indicadores/indicadores.component';
import { FormulaGeneratorComponent } from '../util/formula-generator/formula-generator.component';
import { GestionRiesgoComponent } from '../administrador/gestion-riesgo/gestion-riesgo.component';
import { ControlRiesgoComponent } from '../administrador/control-riesgo/control-riesgo.component';

const routes: Routes = [
// Temporales 

  { path: 'indicadores', component: IndicadoresComponent },
  { path: 'formulaTest', component: FormulaGeneratorComponent },
  { path: 'gestion-riesgo', component: GestionRiesgoComponent },
  { path: 'control-riesgo', component: ControlRiesgoComponent },

  { path: 'app/acceso', component: InicioSesionComponent },
  { path: 'app', component: AreaTrabajoComponent, canActivate: [UserAuthGuard] },

  // Redirección al inicio del aplicativo
  { path: '', redirectTo: 'app/acceso', pathMatch: 'full' },
  { path: '**', redirectTo: 'app/acceso', pathMatch: 'full' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload',  useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
