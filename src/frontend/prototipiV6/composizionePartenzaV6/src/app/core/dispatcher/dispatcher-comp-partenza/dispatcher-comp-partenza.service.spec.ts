import { TestBed } from '@angular/core/testing';

import { DispatcherCompPartenzaService } from './dispatcher-comp-partenza.service';

describe('DispatcherCompPartenzaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DispatcherCompPartenzaService = TestBed.get(DispatcherCompPartenzaService);
    expect(service).toBeTruthy();
  });
});
