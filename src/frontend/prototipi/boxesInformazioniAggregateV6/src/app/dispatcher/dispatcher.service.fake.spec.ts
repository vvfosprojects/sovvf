import { TestBed, inject } from '@angular/core/testing';

import { DispatcherServiceFake } from './dispatcher.service.fake';

describe('DispatcherFakeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DispatcherServiceFake]
    });
  });

  it('should be created', inject([DispatcherServiceFake], (service: DispatcherServiceFake) => {
    expect(service).toBeTruthy();
  }));
});
