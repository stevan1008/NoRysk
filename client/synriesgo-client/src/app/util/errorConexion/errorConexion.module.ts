import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorConexionComponent } from './errorConexion.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    ErrorConexionComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FontAwesomeModule
  ],
  exports: [
    ErrorConexionComponent
  ]
})
export class ErrorConexionModule { }
