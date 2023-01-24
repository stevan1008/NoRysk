import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PantallaEsperaComponent } from './pantallaEspera.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    PantallaEsperaComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    PantallaEsperaComponent
  ]
})
export class PantallaEsperaModule { }
