import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRiesgoComponent } from './gestion-riesgo.component';

describe('GestionRiesgoComponent', () => {
  let component: GestionRiesgoComponent;
  let fixture: ComponentFixture<GestionRiesgoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionRiesgoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRiesgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
