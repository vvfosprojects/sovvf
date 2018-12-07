import { TestBed, inject } from '@angular/core/testing';

import { BoxClickService } from './box-click.service';

describe('BoxClickService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoxClickService]
    });
  });

  it('should be created', inject([BoxClickService], (service: BoxClickService) => {
    expect(service).toBeTruthy();
  }));
});
