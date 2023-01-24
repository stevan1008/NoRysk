import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaTrabajoComponent } from './area-trabajo.component';

describe('AreaTrabajoComponent', () => {
  let component: AreaTrabajoComponent;
  let fixture: ComponentFixture<AreaTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaTrabajoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
