import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

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
        "telefonata ricevuta alle 10:12 di oggi",
        "http://about:blank"),
        new EventoRichiesta(
        "1",
        "assegnazione_partenza",
        "partenza M_45678 assegnata alle 10:15 di oggi", 
        "http://about:blank"),
        new EventoRichiesta(
        "2",
        "uscita_partenza",
        "partenza M_45678 uscita alle 10:18 di oggi", 
        "http://about:blank"),
        new EventoRichiesta(
        "3",
        "arrivo_partenza_sul_posto",
        "partenza M_45678 arrivata sul posto alle 10:30 di oggi", 
         "http://about:blank"),
        new EventoRichiesta(
        "4",
        "fine_intervento_della_partenza",
        "partenza M_45678 in rientro dal posto alle 11:15 di oggi", 
        "http://about:blank"),
        new EventoRichiesta(
        "5",
        "rientro_in_sede_della_partenza",
        "partenza M_45678 rientrata in sede alle 11:45 di oggi", 
        "http://about:blank"),
        new EventoRichiesta(
        "6",
        "chiusura_richiesta",
        "richiesta di assistenza conclusa alle 11:55 di oggi", 
        "http://about:blank")
    ];

    return Observable.of(elencoEventiRichiesta);
    
  }

  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

}