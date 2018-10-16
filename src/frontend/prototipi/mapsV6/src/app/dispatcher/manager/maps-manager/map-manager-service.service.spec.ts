import { TestBed, inject } from '@angular/core/testing';

import { MapManagerService } from './map-manager-service.service';

describe('MapManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapManagerService]
    });
  });

  it('should be created', inject([MapManagerService], (service: MapManagerService) => {
    expect(service).toBeTruthy();
  }));
});
