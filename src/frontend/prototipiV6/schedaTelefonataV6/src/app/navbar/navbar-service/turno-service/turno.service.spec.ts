import { TestBed, inject } from '@angular/core/testing';

import { TurnoService } from './turno.service';

describe('TurnoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TurnoService]
    });
  });

  it('should be created', inject([TurnoService], (service: TurnoService) => {
    expect(service).toBeTruthy();
  }));
});
