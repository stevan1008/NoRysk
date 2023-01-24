import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PantallaEsperaModule } from '../util/pantallaEspera/pantallaEspera.module';
import { ErrorConexionModule } from '../util/errorConexion/errorConexion.module';

@NgModule({
  declarations: [
    InicioSesionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    PantallaEsperaModule,
    ErrorConexionModule
  ],
  exports: [
    InicioSesionComponent
  ]
})
export class AccesoModule { }
