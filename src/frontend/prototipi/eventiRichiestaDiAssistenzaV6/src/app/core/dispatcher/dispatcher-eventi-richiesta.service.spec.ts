import { TestBed, inject } from '@angular/core/testing';

import { DispatcherEventiRichiestaService } from './dispatcher-eventi-richiesta.service';

describe('DispatcherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DispatcherEventiRichiestaService]
    });
  });

  it('should be created', inject([DispatcherEventiRichiestaService], (service: DispatcherEventiRichiestaService) => {
    expect(service).toBeTruthy();
  }));
});
