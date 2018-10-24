import { TestBed, inject } from '@angular/core/testing';

import { FakeMethodService } from './fake-method-service.service';

describe('FakeMethodService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FakeMethodService]
    });
  });

  it('should be created', inject([FakeMethodService], (service: FakeMethodService) => {
    expect(service).toBeTruthy();
  }));
});
