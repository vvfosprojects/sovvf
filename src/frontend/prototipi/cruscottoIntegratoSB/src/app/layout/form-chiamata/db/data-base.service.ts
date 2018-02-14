import { Injectable } from '@angular/core';
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs/Observable";
import { FormChiamataModel } from "../form-chiamata.model";

@Injectable()
export class DataBaseService {

  cercaChiamataURL = "http://www.xxxx.com"; //TODO
  salvaChiamataURL = "http://www.xxxx.com"; //TODO

  chiamataRecuperata: FormChiamataModel;

  constructor(private _http: Http) { }

  /**
   * Questo metodo chiama il webservice che cerca nel db la chiamata in base
   * all'id fornito e ritorna l'oggetto chiamata.
   * @param idChiamata 
   */
  getChiamata(idChiamata) {
    return this._http.get(this.cercaChiamataURL).map(
      response => {
        {
          return this.chiamataRecuperata = JSON.parse(JSON.stringify(response.json))
        };
      })
      .catch(error => Observable.throw(error.json()));
  }

  /**
   * Questo metodo effettua la chiamata al webservice che 
   * si occuperà dell'inserimento nel DB.
   * 
   * @param nuovaChiamata 
   */
  aggiungiChiamata(nuovaChiamata: FormChiamataModel): Observable<FormChiamataModel> {
    return this._http.post(this.salvaChiamataURL, nuovaChiamata)
      .map(this.datiEstratti)
      .catch(this.gestioneErroriObservable);
  }

  private datiEstratti(res: Response) {
    let body = res.json();
    return body.data || {};
  }
  private gestioneErroriObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

}



