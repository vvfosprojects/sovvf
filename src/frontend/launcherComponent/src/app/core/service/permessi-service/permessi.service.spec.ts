import { TestBed } from '@angular/core/testing';

import { PermessiService } from './permessi.service';

describe('PermessiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PermessiService = TestBed.get(PermessiService);
    expect(service).toBeTruthy();
  });
});
