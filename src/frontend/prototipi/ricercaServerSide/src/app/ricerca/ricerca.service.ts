import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RisultatoRicerca } from "./risultato-ricerca";

@Injectable()
export class RicercaService {

  constructor() { }

  /**
   * Servizio fake di restituzione di risultati di ricerca da una chiave
   * di ricerca. Il servizio fake restituisce tre volte la chiave.
   * Per es. se la chiave è 'pippo', il servizio restituisce:
   *   - pippo1 pippo1 pippo1
   *   - pippo2 pippo2 pippo2
   *   - pippo3 pippo3 pippo3
   * @param chiave La chiave di ricerca. 
   */
  public ricerca(chiave: string): Observable<RisultatoRicerca[]> {
    var risultati: RisultatoRicerca[] = [
      new RisultatoRicerca(this.replica3(chiave + "1"), "Questa è la chiave1 di " + chiave),
      new RisultatoRicerca(this.replica3(chiave + "2"), "Questa è la chiave2 di " + chiave),
      new RisultatoRicerca(this.replica3(chiave + "3"), "Questa è la chiave3 di " + chiave),
    ];

    return Observable.of(risultati);
  }

  private replica3(s: string): string {
    return s + " " + s + " " + s;
    
  }
}
