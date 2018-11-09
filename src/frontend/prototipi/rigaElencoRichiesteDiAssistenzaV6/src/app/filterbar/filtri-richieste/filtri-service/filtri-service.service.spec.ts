import { TestBed, inject } from '@angular/core/testing';

import { FiltriService } from './filtri-service.service';

describe('FiltriServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FiltriService]
    });
  });

  it('should be created', inject([FiltriService], (service: FiltriService) => {
    expect(service).toBeTruthy();
  }));
});
