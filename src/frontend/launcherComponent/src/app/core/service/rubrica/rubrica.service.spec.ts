import { TestBed } from '@angular/core/testing';

import { RubricaService } from './rubrica.service';

describe('RubricaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RubricaService = TestBed.get(RubricaService);
    expect(service).toBeTruthy();
  });
});
