import { TestBed, inject } from '@angular/core/testing';

import { EventiRichiestaService } from './eventi-richiesta.service';

describe('EventiRichiestaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventiRichiestaService]
    });
  });

  it('should be created', inject([EventiRichiestaService], (service: EventiRichiestaService) => {
    expect(service).toBeTruthy();
  }));
});
