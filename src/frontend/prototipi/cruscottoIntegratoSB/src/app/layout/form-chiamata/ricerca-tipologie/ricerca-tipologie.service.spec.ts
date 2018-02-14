import { TestBed, inject } from '@angular/core/testing';

import { RicercaTipologieService } from './ricerca-tipologie.service';

describe('RicercaTipologieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RicercaTipologieService]
    });
  });

  it('should ...', inject([RicercaTipologieService], (service: RicercaTipologieService) => {
    expect(service).toBeTruthy();
  }));
});
