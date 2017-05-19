import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { MezzoInServizio } from '../mezzoinservizio/mezzoinservizio.model';
import { PersonaSulMezzo } from "../mezzoinservizio/persona-sul-mezzo.model";

@Injectable()
export class ListaMezziService {
  private mezzi: MezzoInServizio[] = [
    new MezzoInServizio(
      "12345",
      "Centrale",
      "M_4444",
      "APS",
      "12345",
      "InSede",
      new Date(),
      //"333.565.331",
      null,
      true,
      "A1",
      "A",
      new Date(),
      /*[
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Mario Rossi", "Mariolino", true, false),
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Verdi", "Peppino", false, true),
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giacomo Puccini", "Giacomino", false, false),
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Galileo Galilei", "Gelotto", false, false),
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Leonardo Da Vinci", "Leonarduccio", false, false)
      ]*/[]),
    new MezzoInServizio(
      "54321",
      "Tuscolano",
      "M_5555",
      "ABP",
      "54321",
      "InViaggio",
      new Date(),
      "444.333.222",
      true,
      "A1",
      "A",
      new Date(),
      [
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Mario Rossi", "Mariolino", true, false),
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Verdi", "Peppino", false, true),
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giacomo Puccini", "Giacomino", false, false),
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Galileo Galilei", "Gelotto", false, false),
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Leonardo Da Vinci", "Leonarduccio", false, false)
      ]),
    new MezzoInServizio(
      '1',
      'Centrale',
      'M_34564',
      'APS',
      '34564',
      'SulPosto',
      new Date(2017, 4, 17, 12, 10, 0),
      '13423',
      true,
      'APS-01',
      'D',
      new Date(2017, 3, 26, 10, 10, 0),
      [
        new PersonaSulMezzo(
          "FRJKDJD12333",
          "CS Rossi Mario",
          "C.F.: FRJKDJD12333",
          true,
          false
        ),
        new PersonaSulMezzo(
          "RIETJR12345",
          "VP Verdi Mario",
          "C.F.: FRJKDJD12333",
          false,
          false
        ),
        new PersonaSulMezzo(
          "BNCMRO332292",
          "VP Bianchi Mario",
          "C.F.: BNCMRO332292",
          false,
          true
        ),
      ])
  ];

  constructor() { }

  public getMezzi(): Observable<MezzoInServizio[]> {
    return Observable.of(this.mezzi);
  }

}
