import { TestBed, inject } from '@angular/core/testing';

import { EventiManagerService } from './eventi-manager-service.service';

describe('EventiManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventiManagerService]
    });
  });

  it('should be created', inject([EventiManagerService], (service: EventiManagerService) => {
    expect(service).toBeTruthy();
  }));
});
