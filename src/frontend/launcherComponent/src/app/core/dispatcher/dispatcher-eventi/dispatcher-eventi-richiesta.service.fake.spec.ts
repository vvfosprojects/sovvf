import { TestBed, inject } from '@angular/core/testing';

import { DispatcherEventiRichiestaServiceFake } from './dispatcher-eventi-richiesta.service.fake';

describe('DispatcherEventiRichiestaServiceFake', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DispatcherEventiRichiestaServiceFake]
    });
  });

  it('should be created', inject([DispatcherEventiRichiestaServiceFake], (service: DispatcherEventiRichiestaServiceFake) => {
    expect(service).toBeTruthy();
  }));
});
