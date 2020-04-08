import { TestBed, inject } from '@angular/core/testing';

import { SchedaContattoService } from './scheda-contatto.service';

describe('SchedaContattoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchedaContattoService]
    });
  });

  it('should ...', inject([SchedaContattoService], (service: SchedaContattoService) => {
    expect(service).toBeTruthy();
  }));
});
