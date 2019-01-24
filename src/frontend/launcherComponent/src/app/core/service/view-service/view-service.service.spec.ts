import { TestBed, inject } from '@angular/core/testing';

import { ViewService } from './view-service.service';

describe('FilterbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewService]
    });
  });

  it('should be created', inject([ViewService], (service: ViewService) => {
    expect(service).toBeTruthy();
  }));
});
