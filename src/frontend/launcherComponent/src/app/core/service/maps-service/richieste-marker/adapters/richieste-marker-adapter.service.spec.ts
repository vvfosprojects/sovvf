import { TestBed } from '@angular/core/testing';

import { RichiesteMarkerAdapterService } from './richieste-marker-adapter.service';

describe('RichiesteMarkerAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RichiesteMarkerAdapterService = TestBed.get(RichiesteMarkerAdapterService);
    expect(service).toBeTruthy();
  });
});
