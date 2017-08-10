import { Injectable } from '@angular/core';
import { PersonaDaAutorizzare } from "app/gestionepermessi/persona-da-autorizzare.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class PersonaleDaAutorizzareService {
private personeDaAutorizzare: PersonaDaAutorizzare[] =
[
  new PersonaDaAutorizzare("MNBHJU78Y65T453R", "CS Mario Bianchi", "Mariolino"),
  new PersonaDaAutorizzare("BRNGSP78Y65T453R", "CS Giuseppe Bernardi", "Peppino"),
  new PersonaDaAutorizzare("VRDGSP78Y65T453R", "CS Giacomo Verdi", "Giacomino"),
  new PersonaDaAutorizzare("PLTGSP78Y65T453R", "CS Giuseppe Paoletti", "Giuseppino"),
  new PersonaDaAutorizzare("RSSPAL78Y65T453R", "CS Paolo Rossi", "Paolino"),
  new PersonaDaAutorizzare("MRZMLN79E68H501Z", "CTI Manuela Marzotti","Manuelina"),
  new PersonaDaAutorizzare("DNLKIE85P98H380Z", "CTI Daniela Fares","Danielina")
];


  constructor() { }

  public getNominativi(): Observable<PersonaDaAutorizzare[]> {
    return Observable.of(this.personeDaAutorizzare);
  }

}
