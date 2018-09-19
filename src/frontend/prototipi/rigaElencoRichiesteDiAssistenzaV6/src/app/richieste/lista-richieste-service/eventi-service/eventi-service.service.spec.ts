import { TestBed, inject } from '@angular/core/testing';

import { EventiService } from './eventi-service.service';

describe('EventiServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventiService]
    });
  });

  it('should be created', inject([EventiService], (service: EventiService) => {
    expect(service).toBeTruthy();
  }));
});
