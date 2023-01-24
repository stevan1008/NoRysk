import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AccesoModule } from '../acceso/acceso.module';
import { AreaTrabajoModule } from '../area-trabajo/area-trabajo.module';
import { HttpClientModule } from '@angular/common/http';
import { UserAuthGuard } from '../services/guards/UserAuthGuard';

import { FormulaGeneratorModule } from '../util/formula-generator/formula-generator.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AccesoModule,
    AreaTrabajoModule,
    FormulaGeneratorModule
  ],
  providers: [ UserAuthGuard ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
