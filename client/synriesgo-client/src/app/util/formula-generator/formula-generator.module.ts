import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulaGeneratorComponent } from './formula-generator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FormulaGeneratorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FormulaGeneratorModule { }
