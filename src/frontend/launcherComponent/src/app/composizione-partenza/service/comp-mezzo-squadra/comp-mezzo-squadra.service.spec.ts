import { TestBed } from '@angular/core/testing';

import { CompMezzoSquadraService } from './comp-mezzo-squadra.service';

describe('CompMezzoSquadraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompMezzoSquadraService = TestBed.get(CompMezzoSquadraService);
    expect(service).toBeTruthy();
  });
});
