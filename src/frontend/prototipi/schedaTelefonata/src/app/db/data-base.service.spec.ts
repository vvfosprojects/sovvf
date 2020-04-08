import { TestBed, inject } from '@angular/core/testing';

import { DataBaseService } from './data-base.service';

describe('DataBaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataBaseService]
    });
  });

  it('should be created', inject([DataBaseService], (service: DataBaseService) => {
    expect(service).toBeTruthy();
  }));
});
