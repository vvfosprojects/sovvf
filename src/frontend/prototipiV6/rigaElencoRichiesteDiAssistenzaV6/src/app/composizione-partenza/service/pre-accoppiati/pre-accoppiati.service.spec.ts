import { TestBed } from '@angular/core/testing';

import { PreAccoppiatiService } from './pre-accoppiati.service';

describe('PreAccoppiatiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreAccoppiatiService = TestBed.get(PreAccoppiatiService);
    expect(service).toBeTruthy();
  });
});
