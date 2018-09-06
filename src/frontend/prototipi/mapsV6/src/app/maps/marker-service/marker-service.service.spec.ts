import { TestBed, inject } from '@angular/core/testing';

import { MarkerServiceService } from './marker-service.service';

describe('MarkerServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkerServiceService]
    });
  });

  it('should be created', inject([MarkerServiceService], (service: MarkerServiceService) => {
    expect(service).toBeTruthy();
  }));
});
