import { Injectable, Inject } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { MezzoInServizio } from '../mezzoinservizio/mezzoinservizio.model';
import { PersonaSulMezzo } from "../mezzoinservizio/persona-sul-mezzo.model";
import { environment } from 'environments/environment';

const API_URL = environment.apiUrl;

@Injectable()
export class ListaMezziService {
  //private url: string = "http://localhost:2661/api/situazioneMezzi";

  constructor(private http: Http) { }

  public getMezzi(): Observable<MezzoInServizio[]> {
    return this.http.get(API_URL + '/situazioneMezzi')
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.situazioneMezzi || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
