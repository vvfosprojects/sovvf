import { TestBed, inject } from '@angular/core/testing';

import { FilterbarService } from './filterbar-service.service';

describe('FilterbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterbarService]
    });
  });

  it('should be created', inject([FilterbarService], (service: FilterbarService) => {
    expect(service).toBeTruthy();
  }));
});
