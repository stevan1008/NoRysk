import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaTrabajoAdministradorComponent } from './area-trabajo-administrador.component';

describe('AreaTrabajoAdministradorComponent', () => {
  let component: AreaTrabajoAdministradorComponent;
  let fixture: ComponentFixture<AreaTrabajoAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaTrabajoAdministradorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaTrabajoAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
