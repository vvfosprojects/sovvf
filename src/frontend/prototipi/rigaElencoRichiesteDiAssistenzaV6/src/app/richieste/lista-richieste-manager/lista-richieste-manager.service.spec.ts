import { TestBed, inject } from '@angular/core/testing';

import { ListaRichiesteManagerService } from './lista-richieste-manager.service';

describe('ListaRichiesteManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListaRichiesteManagerService]
    });
  });

  it('should be created', inject([ListaRichiesteManagerService], (service: ListaRichiesteManagerService) => {
    expect(service).toBeTruthy();
  }));
});
