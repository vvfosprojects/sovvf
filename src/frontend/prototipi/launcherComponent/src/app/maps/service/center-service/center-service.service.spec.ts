import { TestBed, inject } from '@angular/core/testing';

import { CenterService } from './center-service.service';

describe('CenterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CenterService]
    });
  });

  it('should be created', inject([CenterService], (service: CenterService) => {
    expect(service).toBeTruthy();
  }));
});
