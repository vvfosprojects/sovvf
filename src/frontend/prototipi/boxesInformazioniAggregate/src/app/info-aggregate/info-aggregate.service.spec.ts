import { TestBed, inject } from '@angular/core/testing';

import { InfoAggregateService } from './info-aggregate.service';

describe('InfoAggregateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfoAggregateService]
    });
  });

  it('should be created', inject([InfoAggregateService], (service: InfoAggregateService) => {
    expect(service).toBeTruthy();
  }));
});
