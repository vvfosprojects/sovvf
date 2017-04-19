import { TestBed, inject } from '@angular/core/testing';

import { MezzoInServizioService } from './mezzo-in-servizio.service';

describe('MezzoInServizioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MezzoInServizioService]
    });
  });

  it('should ...', inject([MezzoInServizioService], (service: MezzoInServizioService) => {
    expect(service).toBeTruthy();
  }));
});
