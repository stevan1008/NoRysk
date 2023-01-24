import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ErrorConexionComponent } from './errorConexion.component';

describe('ErrorConexionComponent', () => {
  let component: ErrorConexionComponent;
  let fixture: ComponentFixture<ErrorConexionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorConexionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorConexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
