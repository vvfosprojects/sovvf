import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { InfoAggregate } from './info-aggregate.model';
import { InfoMezzo } from './info-mezzo.model';
import { FunzionariSo } from './funzionari-so.model';
import { DescMeteoMap } from './desc-meteo-map.class';

import { environment } from "environments/environment";

const API_URL = environment.apiUrl;

@Injectable()
export class InfoAggregateService {

  constructor(private http: Http) { }

  public getInfoAggregate(): Observable<InfoAggregate[]> {
    return this.http
      .get(API_URL + '/infoAggregate')
      .map(response => response.json().infoAggregate.map(r => {
        let informazioni = Object.create(InfoAggregate.prototype);
        return Object.assign(informazioni, r);
      }))
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }
}
