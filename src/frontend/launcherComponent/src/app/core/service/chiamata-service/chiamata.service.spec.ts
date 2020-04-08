import { TestBed } from '@angular/core/testing';

import { ChiamataService } from './chiamata.service';

describe('ChiamataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChiamataService = TestBed.get(ChiamataService);
    expect(service).toBeTruthy();
  });
});
