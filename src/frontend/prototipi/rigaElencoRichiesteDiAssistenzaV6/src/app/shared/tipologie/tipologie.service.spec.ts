import { TestBed, inject } from '@angular/core/testing';

import { TipologieService } from './tipologie.service';

describe('TipologieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipologieService]
    });
  });

  it('should be created', inject([TipologieService], (service: TipologieService) => {
    expect(service).toBeTruthy();
  }));
});
