import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionUsuariosComponent } from './gestion-usuarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorConexionModule } from 'src/app/util/errorConexion/errorConexion.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [
    GestionUsuariosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatSelectFilterModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ErrorConexionModule
  ],
  exports: [
    GestionUsuariosComponent
  ]
})
export class GestionUsuariosModule { }
