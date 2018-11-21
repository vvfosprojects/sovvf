import { TestBed } from '@angular/core/testing';

import { CompPartenzaService } from './comp-partenza.service';

describe('CompPartenzaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompPartenzaService = TestBed.get(CompPartenzaService);
    expect(service).toBeTruthy();
  });
});
