import { TestBed, inject } from '@angular/core/testing';

import { DispatcherService } from './dispatcher-lista-richieste.service';

describe('DispatcherFakeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DispatcherService]
    });
  });

  it('should be created', inject([DispatcherService], (service: DispatcherService) => {
    expect(service).toBeTruthy();
  }));
});
