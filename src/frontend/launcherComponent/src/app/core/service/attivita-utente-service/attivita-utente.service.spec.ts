import { TestBed } from '@angular/core/testing';

import { AttivitaUtenteService } from './attivita-utente.service';

describe('AttivitaUtenteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttivitaUtenteService = TestBed.get(AttivitaUtenteService);
    expect(service).toBeTruthy();
  });
});
