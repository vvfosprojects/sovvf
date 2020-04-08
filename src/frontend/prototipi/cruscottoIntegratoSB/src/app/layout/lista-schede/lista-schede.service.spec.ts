import { TestBed, inject } from '@angular/core/testing';

import { ListaSchedeService } from './lista-schede.service';

describe('ListaSchedeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListaSchedeService]
    });
  });

  it('should be created', inject([ListaSchedeService], (service: ListaSchedeService) => {
    expect(service).toBeTruthy();
  }));
});
