/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DndHandlerService } from './dnd-handler.service';

describe('DndHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DndHandlerService]
    });
  });

  it('should ...', inject([DndHandlerService], (service: DndHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
