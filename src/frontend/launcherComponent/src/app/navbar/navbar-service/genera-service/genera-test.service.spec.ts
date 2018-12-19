import { TestBed, inject } from '@angular/core/testing';

import { GeneraTestService } from './genera-test.service';

describe('GeneraTestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneraTestService]
    });
  });

  it('should be created', inject([GeneraTestService], (service: GeneraTestService) => {
    expect(service).toBeTruthy();
  }));
});
