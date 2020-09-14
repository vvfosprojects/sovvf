import { TestBed } from '@angular/core/testing';

import { ModificaPartenzaService } from './modifica-partenza.service';

describe('ModificaPartenzaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModificaPartenzaService = TestBed.get(ModificaPartenzaService);
    expect(service).toBeTruthy();
  });
});
