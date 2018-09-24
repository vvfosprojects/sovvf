import { TestBed, inject } from '@angular/core/testing';

import { DispatcherFakeService } from './dispatcher-fake.service';

describe('DispatcherFakeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DispatcherFakeService]
    });
  });

  it('should be created', inject([DispatcherFakeService], (service: DispatcherFakeService) => {
    expect(service).toBeTruthy();
  }));
});
