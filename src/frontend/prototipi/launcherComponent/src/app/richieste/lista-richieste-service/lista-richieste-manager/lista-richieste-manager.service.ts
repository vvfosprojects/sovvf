import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SintesiRichiesta } from '../../../shared/model/sintesi-richiesta.model';

@Injectable({
  providedIn: 'root'
})
export class ListaRichiesteManagerService {
  richieste: SintesiRichiesta[];

  constructor() {
  }

  getData(): Observable<SintesiRichiesta[]> {
    return of(this.richieste);
  }

  nuoveRichieste() {
    const nuoveRichieste = [];
    return of(nuoveRichieste);
  }

  getRichiestaFromId(id) {
    return this.richieste.find(x => x.id === id);
  }
}
