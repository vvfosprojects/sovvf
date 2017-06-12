import { TestBed, inject } from '@angular/core/testing';

import { GestionePermessiFakeService } from './gestione-permessi-fake.service';

describe('GestionePermessiFakeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GestionePermessiFakeService]
    });
  });

  it('should be created', inject([GestionePermessiFakeService], (service: GestionePermessiFakeService) => {
    expect(service).toBeTruthy();
  }));
});
