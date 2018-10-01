import { TestBed, inject } from '@angular/core/testing';

import { MarkedServiceService } from './marked-service.service';

describe('MarkedServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkedServiceService]
    });
  });

  it('should be created', inject([MarkedServiceService], (service: MarkedServiceService) => {
    expect(service).toBeTruthy();
  }));
});
