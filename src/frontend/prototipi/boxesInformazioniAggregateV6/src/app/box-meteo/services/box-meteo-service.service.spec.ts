import { TestBed, inject } from '@angular/core/testing';

import { BoxMeteoServiceService } from './box-meteo-service.service';

describe('BoxMeteoServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoxMeteoServiceService]
    });
  });

  it('should be created', inject([BoxMeteoServiceService], (service: BoxMeteoServiceService) => {
    expect(service).toBeTruthy();
  }));
});
