import { TestBed, inject } from '@angular/core/testing';

import { PersonaleDaAutorizzareService } from './personale-da-autorizzare.service';

describe('PersonaleDaAutorizzareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonaleDaAutorizzareService]
    });
  });

  it('should be created', inject([PersonaleDaAutorizzareService], (service: PersonaleDaAutorizzareService) => {
    expect(service).toBeTruthy();
  }));
});
