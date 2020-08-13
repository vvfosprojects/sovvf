import { TestBed } from '@angular/core/testing';

import { TrasferimentoChiamataService } from './trasferimento-chiamata.service';

describe('TrasferimentoChiamataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrasferimentoChiamataService = TestBed.get(TrasferimentoChiamataService);
    expect(service).toBeTruthy();
  });
});
