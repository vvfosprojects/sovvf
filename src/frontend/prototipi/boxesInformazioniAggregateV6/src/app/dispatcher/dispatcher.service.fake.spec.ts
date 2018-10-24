import { TestBed, inject } from '@angular/core/testing';
import {DispatcherInfoAggregateServiceFake} from './dispatcher.service.fake';


describe('DispatcherInfoAggregateServiceFake', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DispatcherInfoAggregateServiceFake]
    });
  });

  it('should be created', inject([DispatcherInfoAggregateServiceFake], (service: DispatcherInfoAggregateServiceFake) => {
    expect(service).toBeTruthy();
  }));
});
