import { TestBed, inject } from '@angular/core/testing';

import { AdapterAlberoService } from './adapter-albero.service';

describe('AdapterAlberoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdapterAlberoService]
    });
  });

  it('should be created', inject([AdapterAlberoService], (service: AdapterAlberoService) => {
    expect(service).toBeTruthy();
  }));
});
