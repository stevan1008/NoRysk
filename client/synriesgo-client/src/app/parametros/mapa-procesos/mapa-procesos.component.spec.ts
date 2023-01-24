import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaProcesosComponent } from './mapa-procesos.component';

describe('MapaProcesosComponent', () => {
  let component: MapaProcesosComponent;
  let fixture: ComponentFixture<MapaProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaProcesosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
