import { TestBed } from '@angular/core/testing';

import { GestionRiesgoService } from './gestion-riesgo.service';

describe('GestionRiesgoService', () => {
  let service: GestionRiesgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionRiesgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
