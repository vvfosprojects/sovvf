/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ListaSquadreService } from './lista-squadre.service';

describe('ListaSquadreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListaSquadreService]
    });
  });

  it('should ...', inject([ListaSquadreService], (service: ListaSquadreService) => {
    expect(service).toBeTruthy();
  }));
});
