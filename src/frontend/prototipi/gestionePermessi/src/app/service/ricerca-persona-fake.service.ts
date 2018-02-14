import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { Persona } from "../model/persona.model";

@Injectable()
export class RicercaPersonaFakeService {
private ricercaPersona: Persona[] =
[
  new Persona("MNBHJU78Y65T453R", "CS Mario Bianchi", "Mariolino"),
  new Persona("BRNGSP78Y65T453R", "CS Giuseppe Bernardi", "Peppino"),
  new Persona("VRDGSP78Y65T453R", "CS Giacomo Verdi", "Giacomino"),
  new Persona("PLTGSP78Y65T453R", "CS Giuseppe Paoletti", "Giuseppino"),
  new Persona("RSSPAL78Y65T453R", "CS Paolo Rossi", "Paolino"),
  new Persona("MRZMLN79E68H501Z", "CTI Manuela Marzotti","Manuelina"),
  new Persona("DNLKIE85P98H380Z", "CTI Daniela Fares","Danielina")
];


  constructor() { }

  public cerca(key: string, codiceUo: string): Observable<Persona[]> {
    let result = this.ricercaPersona.filter(p => p.descrizione.match(/key/i));
    console.log("Ricerca persona con chiave", key, "Restituito:", result);
    return Observable.of(result);
  }
}
