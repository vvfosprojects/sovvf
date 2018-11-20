import { TestBed, inject } from '@angular/core/testing';

import { MeteoService } from './meteo-service.service';

describe('MeteoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeteoService]
    });
  });

  it('should be created', inject([MeteoService], (service: MeteoService) => {
    expect(service).toBeTruthy();
  }));
});
