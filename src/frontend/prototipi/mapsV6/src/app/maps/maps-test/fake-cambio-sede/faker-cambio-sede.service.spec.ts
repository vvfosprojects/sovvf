import { TestBed, inject } from '@angular/core/testing';

import { FakerCambioSedeService } from './faker-cambio-sede.service';

describe('FakerCambioSedeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FakerCambioSedeService]
    });
  });

  it('should be created', inject([FakerCambioSedeService], (service: FakerCambioSedeService) => {
    expect(service).toBeTruthy();
  }));
});
