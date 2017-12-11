import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
//import * as moment from 'moment';

import { EventoRichiesta } from '../evento-richiesta/evento-richiesta.model';

@Injectable()
export class EventiRichiestaServiceFake {

  //private eventiRichiesta: EventoRichiesta[];

  constructor() { }

  public getEventiRichiesta(): Observable<EventoRichiesta[]> {
    /*
    return this.http.get(API_URL + 'eventiRichiestaAssistenza').    
    map((r : Response) => r.json().eventiRichiestaAssistenza.
      map(e => 
        {
        let eventoRichiesta = Object.create(EventoRichiesta.prototype);
        return Object.assign(eventoRichiesta, e);
        }
      )
    )
    .catch(this.handleError);
    */
    var elencoEventiRichiesta : EventoRichiesta[] = [
      new EventoRichiesta(
        "0", 
        "telefonata", 
        new Date("2017-10-20T10:04"),
        "",
        "richiesta da 118",
        "http://about:blank"),
        new EventoRichiesta(
        "1",
        "assegnazione_partenza",
        new Date("2017-10-20T10:09"),
        "M_45678", 
        "dall'operatore UTENTE1",
        "http://about:blank"),
        new EventoRichiesta(
        "2",
        "uscita_partenza",
        new Date("2017-10-20T10:11"),
        "M_45678",
        "dal Distaccamento Centrale", 
        "http://about:blank"),
        new EventoRichiesta(
        "3",
        "arrivo_partenza_sul_posto",
        new Date("2017-10-20T10:40"),
        "M_45678",
        "", 
         "http://about:blank"),
        new EventoRichiesta(
        "4",
        "fine_intervento_della_partenza",
        new Date("2017-10-20T11:54"),
        "M_45678",
        "", 
        "http://about:blank"),
        new EventoRichiesta(
        "5",
        "rientro_in_sede_della_partenza",
        new Date("2017-10-20T12:34"),
        "M_45678",
        "nel Distaccamento Centrale", 
        "http://about:blank"),
        new EventoRichiesta(
        "6",
        "chiusura_richiesta",
        new Date("2017-10-20T12:44"),
        "",
        "dall'operatore UTENTE1", 
        "http://about:blank")
    ];

    return Observable.of(elencoEventiRichiesta);
    
  }

  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

}