import { Injectable, Inject } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpResponse }  from '@angular/common/http';
// import { Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { ModificaStatoMezzo } from './mezzoinservizio/modifica-stato-mezzo.model';
import { environment } from 'environments/environment';

const API_URL = environment.apiUrl;

@Injectable()
export class ModificaStatoService {
  //private url: string = "http://localhost:2661/api/modificaMezzo";


  constructor(private http: HttpClient) {
  
   }

 
  public sendModStatoMezzo(modstato : ModificaStatoMezzo): Observable<ModificaStatoMezzo> {
     return this.http.put<ModificaStatoMezzo[]>(API_URL + '/modificaMezzo', modstato)
                     .map(risposta => risposta['modf'] as ModificaStatoMezzo)
                     .catch(this.handleError);
  }
    


  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
