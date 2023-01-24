import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaProcesosComponent } from './mapa-procesos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ErrorConexionModule } from 'src/app/util/errorConexion/errorConexion.module';


@NgModule({
  declarations: [
    MapaProcesosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSlideToggleModule,
    ErrorConexionModule
  ],
  exports: [
    MapaProcesosComponent
  ]
})
export class MapaProcesosModule { }
