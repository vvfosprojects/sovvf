import { TestBed, inject } from '@angular/core/testing';
import {DispatcherInfoAggregateService} from './dispatcher-boxes.service';


describe('DispatcherInfoAggregateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DispatcherInfoAggregateService]
    });
  });

  it('should be created', inject([DispatcherInfoAggregateService], (service: DispatcherInfoAggregateService) => {
    expect(service).toBeTruthy();
  }));
});
