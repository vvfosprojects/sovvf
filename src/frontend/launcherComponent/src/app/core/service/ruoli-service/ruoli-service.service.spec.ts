import { TestBed } from '@angular/core/testing';

import { RuoliService } from './ruoli-service.service';

describe('RuoliServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RuoliService = TestBed.get(RuoliService);
    expect(service).toBeTruthy();
  });
});
