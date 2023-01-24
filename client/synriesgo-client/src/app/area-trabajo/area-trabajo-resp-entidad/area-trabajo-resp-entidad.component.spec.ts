import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaTrabajoRespEntidadComponent } from './area-trabajo-resp-entidad.component';

describe('AreaTrabajoRespEntidadComponent', () => {
  let component: AreaTrabajoRespEntidadComponent;
  let fixture: ComponentFixture<AreaTrabajoRespEntidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaTrabajoRespEntidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaTrabajoRespEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
