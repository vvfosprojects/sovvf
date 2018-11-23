import { TestBed, inject } from '@angular/core/testing';

import { PartenzaService } from './partenza.service';

describe('PartenzaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartenzaService]
    });
  });

  it('should be created', inject([PartenzaService], (service: PartenzaService) => {
    expect(service).toBeTruthy();
  }));
});
