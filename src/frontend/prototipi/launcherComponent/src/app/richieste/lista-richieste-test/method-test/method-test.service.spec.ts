import { TestBed, inject } from '@angular/core/testing';

import { MethodTestService } from './method-test.service';

describe('MethodTestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MethodTestService]
    });
  });

  it('should be created', inject([MethodTestService], (service: MethodTestService) => {
    expect(service).toBeTruthy();
  }));
});
