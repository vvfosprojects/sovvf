/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CompositoreService } from './compositore.service';

describe('CompositoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompositoreService]
    });
  });

  it('should ...', inject([CompositoreService], (service: CompositoreService) => {
    expect(service).toBeTruthy();
  }));
});
