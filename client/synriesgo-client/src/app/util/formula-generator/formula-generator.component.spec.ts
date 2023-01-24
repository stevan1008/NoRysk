import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaGeneratorComponent } from './formula-generator.component';

describe('FormulaGeneratorComponent', () => {
  let component: FormulaGeneratorComponent;
  let fixture: ComponentFixture<FormulaGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
