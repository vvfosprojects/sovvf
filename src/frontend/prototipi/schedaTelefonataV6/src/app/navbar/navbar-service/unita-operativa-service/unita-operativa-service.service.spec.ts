import { TestBed, inject } from '@angular/core/testing';

import { UnitaOperativaService } from './unita-operativa.service';

describe('UnitaOperativaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitaOperativaService]
    });
  });

  it('should be created', inject([UnitaOperativaService], (service: UnitaOperativaService) => {
    expect(service).toBeTruthy();
  }));
});
