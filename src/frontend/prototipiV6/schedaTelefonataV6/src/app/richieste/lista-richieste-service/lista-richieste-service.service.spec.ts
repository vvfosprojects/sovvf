import { TestBed, inject } from '@angular/core/testing';

import { ListaRichiesteService } from './lista-richieste-service.service';

describe('ListaRichiesteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListaRichiesteService]
    });
  });

  it('should be created', inject([ListaRichiesteService], (service: ListaRichiesteService) => {
    expect(service).toBeTruthy();
  }));
});
