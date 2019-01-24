import { TestBed, inject } from '@angular/core/testing';

import { DirectionService } from './direction-service.service';

describe('DirectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectionService]
    });
  });

  it('should be created', inject([DirectionService], (service: DirectionService) => {
    expect(service).toBeTruthy();
  }));
});
