import { TestBed, inject } from '@angular/core/testing';

import { InterventiService } from './interventi.service';

describe('InterventiServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterventiService]
    });
  });

  it('should ...', inject([InterventiService], (service: InterventiService) => {
    expect(service).toBeTruthy();
  }));
});
