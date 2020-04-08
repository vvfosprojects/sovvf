import { TestBed } from '@angular/core/testing';

import { GestioneUtentiService } from './gestione-utenti.service';

describe('GestioneUtentiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GestioneUtentiService = TestBed.get(GestioneUtentiService);
    expect(service).toBeTruthy();
  });
});
