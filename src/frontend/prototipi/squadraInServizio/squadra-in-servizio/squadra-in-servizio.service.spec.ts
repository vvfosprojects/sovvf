import { TestBed, inject } from '@angular/core/testing';

import { SquadraInServizioService } from './squadra-in-servizio.service';

describe('SquadraInServizioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SquadraInServizioService]
    });
  });

  it('should ...', inject([SquadraInServizioService], (service: SquadraInServizioService) => {
    expect(service).toBeTruthy();
  }));
});
