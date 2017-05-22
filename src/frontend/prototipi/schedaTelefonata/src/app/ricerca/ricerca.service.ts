import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RisultatoRicerca } from "./risultato-ricerca";
import { Http } from "@angular/http";
import 'rxjs/add/operator/toPromise';
import { RicercaTipologieService } from "app/ricerca-tipologie/ricerca-tipologie.service";

@Injectable()
export class RicercaService {

  constructor(private http: Http, private ricercaTipologieService: RicercaTipologieService) {

  }

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
    // var risultati: RisultatoRicerca[] = [
    //   new RisultatoRicerca("id1", this.replica3(chiave + "1"), "Questa è la chiave1 di " + chiave),
    //   new RisultatoRicerca("id2", this.replica3(chiave + "2"), "Questa è la chiave2 di " + chiave),
    //   new RisultatoRicerca("id3", this.replica3(chiave + "3"), "Questa è la chiave3 di " + chiave),
    // ];

    // return Observable.of(risultati);

    return Observable.of(this.ricercaTipologieService.search(chiave)
      .map(ti => new RisultatoRicerca(
        ti.id, 
        ti.descrizione,
        "")));
  }
  /**
   * Esempio di chiamata a servizio remoto.
   */
  // getCountries() {
  //   /*   return this.http.get('https://raw.githubusercontent.com/oferh/ng2-completer/master/demo/res/data/countries.json')
  //                  .toPromise()
  //                  .then(res => <any[]> res.json().data)
  //                  .then(data => { return data; });*/
  //   return this.http.get("https://raw.githubusercontent.com/oferh/ng2-completer/master/demo/res/data/countries.json")
  //     .map(response => response.json());
  // }

  private replica3(s: string): string {
    return s + " " + s + " " + s;

  }

}

