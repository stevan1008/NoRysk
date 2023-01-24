import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaneacionEstrategicaComponent } from './planeacion-estrategica.component';

describe('PlaneacionEstrategicaComponent', () => {
  let component: PlaneacionEstrategicaComponent;
  let fixture: ComponentFixture<PlaneacionEstrategicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaneacionEstrategicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaneacionEstrategicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
