import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorConexionModule } from 'src/app/util/errorConexion/errorConexion.module';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GestionSedesComponent } from './gestion-sedes.component';


@NgModule({
  declarations: [
    GestionSedesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorConexionModule,
    DragDropModule,
    MatTooltipModule
  ],
  exports: [
    GestionSedesComponent
  ]
})
export class GestionSedesModule { }
