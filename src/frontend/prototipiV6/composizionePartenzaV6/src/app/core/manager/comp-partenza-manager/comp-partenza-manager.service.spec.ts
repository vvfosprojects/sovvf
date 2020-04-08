import { TestBed } from '@angular/core/testing';

import { CompPartenzaManagerService } from './comp-partenza-manager.service';

describe('CompPartenzaManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompPartenzaManagerService = TestBed.get(CompPartenzaManagerService);
    expect(service).toBeTruthy();
  });
});
