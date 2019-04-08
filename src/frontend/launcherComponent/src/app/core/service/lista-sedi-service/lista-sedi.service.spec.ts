import { TestBed } from '@angular/core/testing';

import { ListaSediService } from './lista-sedi.service';

describe('ListaSediService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListaSediService = TestBed.get(ListaSediService);
    expect(service).toBeTruthy();
  });
});
