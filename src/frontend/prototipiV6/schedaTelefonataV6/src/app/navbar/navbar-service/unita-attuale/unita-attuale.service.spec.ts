import { TestBed, inject } from '@angular/core/testing';

import { UnitaAttualeService } from './unita-attuale.service';

describe('UnitaAttualeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitaAttualeService]
    });
  });

  it('should be created', inject([UnitaAttualeService], (service: UnitaAttualeService) => {
    expect(service).toBeTruthy();
  }));
});
