import { TestBed, inject } from '@angular/core/testing';

import { CompFiltriService } from './comp-filtri.service';

describe('CompFiltriService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompFiltriService]
    });
  });

  it('should be created', inject([CompFiltriService], (service: CompFiltriService) => {
    expect(service).toBeTruthy();
  }));
});
