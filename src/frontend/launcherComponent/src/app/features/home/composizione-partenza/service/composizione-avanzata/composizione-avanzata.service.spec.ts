import { TestBed } from '@angular/core/testing';

import { ComposizioneAvanzataService } from './composizione-avanzata.service';

describe('ComposizioneAvanzataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComposizioneAvanzataService = TestBed.get(ComposizioneAvanzataService);
    expect(service).toBeTruthy();
  });
});
