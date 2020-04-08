import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { Http } from "@angular/http";
import { SchedaContatto } from "../scheda-contatto/scheda-contatto.model";

@Injectable()
export class ListaSchedeService_FakeJson {
  private schede: SchedaContatto[] = JSON.parse(`
  [
    {
      "idScheda": 798495,
      "dataOrainserimento": "2017-06-25T01:02:10.4551733+02:00", 
      "idOperatore": 205, 
      "idPostazione":"121156A",
      "nomeUtente": "MARIO ROSSI",
      "numTelefono": 3351234567,
      "indirizzo": "Via Cavour, 5, Roma, RM",
      "infoAddizionali": "Portone Uffici Centrali VVF",
      "classificazioneNUE": "Incendio", 
      "attributiClassificazione":"Attributi di classificazione",
      "note":"Note",
      "priorita": 5,
      "numPersoneCoinvolte":"2",
      "competenza":"VVF"
    },
    {
      "idScheda": 587469,
      "dataOrainserimento": "2015-06-15T01:02:10.4551733+02:00", 
      "idOperatore": 549, 
      "idPostazione":"121165B",
      "nomeUtente": "ALDO BALDO",
      "numTelefono": 3334587993,
      "indirizzo": "Via Roma, 7, Milano, MI",
      "infoAddizionali": "Angolo via della Spiga",
      "classificazioneNUE": "Apertura porta", 
      "attributiClassificazione":"Attributi di classificazione",
      "note":"Note2",
      "priorita": 1,
      "numPersoneCoinvolte":"1",
      "competenza":"VVF"
    }
  ]`);
  constructor(private http: Http) { }

  public getSchede(): Observable<SchedaContatto[]> {
    return Observable.of(this.schede);
  }

  public getScheda(id: number | string): Observable<SchedaContatto> {
    return Observable.of(this.schede 
       // (+) before `id` turns the string into a number
       .find(scheda => scheda.idScheda === +id));
  }
}