import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import * as moment from 'moment';

import { SintesiRichiesta } from '../sintesi-richiesta/sintesi-richiesta.model';
import { environment } from "../../../../../../src/environments/environment";
import { Mezzo } from "../mezzo/mezzo.model";
import { Componente } from "../componente/componente.model";
import { Squadra } from "../sintesi-richiesta/squadra.model";

const API_URL = environment.apiUrl;

@Injectable()
export class SintesiRichiesteService {

  constructor(private http: Http) { }

  public getSintesiRichieste(): Observable<SintesiRichiesta[]> {
    return this.http
      .get(API_URL + '/sintesiRichiesteAssistenza')
      .map(response => response.json().sintesiRichieste.map(r => {
        let richiesta = Object.create(SintesiRichiesta.prototype);
        return Object.assign(richiesta, r);
      }))
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }
}