import { TestBed, inject } from '@angular/core/testing';

import { RichiestaSelezionataService } from './richiesta-selezionata-service.service';

describe('RichiestaSelezionataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RichiestaSelezionataService]
    });
  });

  it('should be created', inject([RichiestaSelezionataService], (service: RichiestaSelezionataService) => {
    expect(service).toBeTruthy();
  }));
});
