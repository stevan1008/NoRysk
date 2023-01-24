import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSedesComponent } from './gestion-sedes.component';

describe('GestionSedesComponent', () => {
  let component: GestionSedesComponent;
  let fixture: ComponentFixture<GestionSedesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionSedesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionSedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
