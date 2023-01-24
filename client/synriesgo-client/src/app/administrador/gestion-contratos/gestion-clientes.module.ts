import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionClientesComponent } from './gestion-clientes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';
import { ErrorConexionModule } from 'src/app/util/errorConexion/errorConexion.module';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    GestionClientesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
    NgxMatSelectSearchModule,
    MatSelectFilterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DataTablesModule,
    ErrorConexionModule
  ],
  exports: [
    GestionClientesComponent
  ]
})
export class GestionClientesModule { }
