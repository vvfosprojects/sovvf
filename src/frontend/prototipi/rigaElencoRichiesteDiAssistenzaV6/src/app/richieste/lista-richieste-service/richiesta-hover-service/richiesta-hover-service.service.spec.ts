import { TestBed, inject } from '@angular/core/testing';

import { RichiestaHoverService } from './richiesta-hover-service.service';

describe('RichiestaHoverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RichiestaHoverService]
    });
  });

  it('should be created', inject([RichiestaHoverService], (service: RichiestaHoverService) => {
    expect(service).toBeTruthy();
  }));
});
