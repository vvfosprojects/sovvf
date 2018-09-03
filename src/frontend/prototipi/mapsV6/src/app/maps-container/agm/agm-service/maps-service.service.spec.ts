import { TestBed, inject } from '@angular/core/testing';

import { MapsService } from './maps-service.service';

describe('MapsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapsService]
    });
  });

  it('should be created', inject([MapsService], (service: MapsService) => {
    expect(service).toBeTruthy();
  }));
});
