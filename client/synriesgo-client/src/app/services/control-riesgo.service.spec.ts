import { TestBed } from '@angular/core/testing';

import { ControlRiesgoService } from './control-riesgo.service';

describe('ControlRiesgoService', () => {
  let service: ControlRiesgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlRiesgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
