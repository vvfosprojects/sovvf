import { TestBed } from '@angular/core/testing';

import { MezziInServizioService } from './mezzi-in-servizio.service';

describe('MezziInServizioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MezziInServizioService = TestBed.get(MezziInServizioService);
    expect(service).toBeTruthy();
  });
});
