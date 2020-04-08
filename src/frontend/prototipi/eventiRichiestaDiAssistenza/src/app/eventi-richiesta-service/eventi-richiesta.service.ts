import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Http, Response } from '@angular/http';
import { EventoRichiesta } from '../evento-richiesta/evento-richiesta.model';
import { environment } from "../../environments/environment";

const API_URL = environment.apiUrl;

@Injectable()
export class EventiRichiestaService {

  private eventtRichiesta: EventoRichiesta[];

  constructor(private http: Http) { }

  public getEventiRichiesta(): Observable<EventoRichiesta[]> {
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
  };

  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }

}