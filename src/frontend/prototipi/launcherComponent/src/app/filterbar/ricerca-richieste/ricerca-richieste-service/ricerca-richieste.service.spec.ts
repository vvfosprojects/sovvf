import { TestBed, inject } from '@angular/core/testing';

import { RicercaRichiesteService } from './ricerca-richieste.service';

describe('RicercaRichiesteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RicercaRichiesteService]
    });
  });

  it('should be created', inject([RicercaRichiesteService], (service: RicercaRichiesteService) => {
    expect(service).toBeTruthy();
  }));
});
