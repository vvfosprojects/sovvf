import { TestBed, inject } from '@angular/core/testing';

import { SituazionePermessiFakeService } from './situazione-permessi-fake.service';

describe('SituazionePermessiFakeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SituazionePermessiFakeService]
    });
  });

  it('should be created', inject([SituazionePermessiFakeService], (service: SituazionePermessiFakeService) => {
    expect(service).toBeTruthy();
  }));
});
