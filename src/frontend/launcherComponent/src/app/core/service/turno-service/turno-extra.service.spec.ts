import { TestBed, inject } from '@angular/core/testing';

import { TurnoExtraService } from './turno-extra.service';

describe('TurnoExtraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TurnoExtraService]
    });
  });

  it('should be created', inject([TurnoExtraService], (service: TurnoExtraService) => {
    expect(service).toBeTruthy();
  }));
});
