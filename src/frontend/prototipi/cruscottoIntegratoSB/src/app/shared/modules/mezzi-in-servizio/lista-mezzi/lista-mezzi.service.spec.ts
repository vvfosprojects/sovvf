import { TestBed, inject } from '@angular/core/testing';

import { ListaMezziService } from './lista-mezzi.service';

describe('ListaMezziService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListaMezziService]
    });
  });

  it('should ...', inject([ListaMezziService], (service: ListaMezziService) => {
    expect(service).toBeTruthy();
  }));
});
