import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { MezzoInServizio } from '../mezzoinservizio/mezzoinservizio.model';
import { PersonaSulMezzo } from "../mezzoinservizio/persona-sul-mezzo.model";
import { StatiSuccessivi } from "../mezzoinservizio/codici-stato-mezzo-succ.model";

@Injectable()
export class ListaMezziService_Fake {
  private mezzi: MezzoInServizio[] = [
       new MezzoInServizio(
      "121",
      "Centrale",
      "M_43445   APS",
      "43445",
      "InSede",
      new Date(),
      "134.565.331",
      true,
      "1/A",
      "A 12/06/2017",
      [
        new PersonaSulMezzo("RSSMRI78Y65T453R", "CS Mario Rossi", "Mariolino", true, false, false),
        new PersonaSulMezzo("VRDGSP78Y65T453R", "CS Giuseppe Verdi", "Peppino", false, true, true),
        new PersonaSulMezzo("PCCGCM78Y65T453R", "CS Giacomo Puccini", "Giacomino", false, false, false),
        new PersonaSulMezzo("GLLGLL78Y65T453R", "CS Galileo Galilei", "Gelotto", false, false, true),
        new PersonaSulMezzo("DVCLND78Y65T453R", "CS Leonardo Da Vinci", "Leonarduccio", false, false, false)
      ],
      [
       new StatiSuccessivi("")
      ]),
       new MezzoInServizio(
      "123",
      "Centrale",
      "M_13445   APS",
      "13445",
      "InViaggio",
      new Date(2017, 5, 5, 10, 15, 20),
      "134.565.332",
      true,
      "2/A",
      "A 11/06/2017",
      [
        new PersonaSulMezzo("RSSMRI78Y65T453R", "CS Mario Rossi", "Mariolino", true, false, true),
        new PersonaSulMezzo("VRDGSP78Y65T453R", "CS Giuseppe Verdi", "Peppino", false, true, false),
        new PersonaSulMezzo("PCCGCM78Y65T453R", "CS Giacomo Puccini", "Giacomino", false, false, false),
        new PersonaSulMezzo("GLLGLL78Y65T453R", "CS Galileo Galilei", "Gelotto", false, false, true),
        new PersonaSulMezzo("DVCLND78Y65T453R", "CS Leonardo Da Vinci", "Leonarduccio", false, false, false)
      ],
      [
       new StatiSuccessivi("InRientro"),
       new StatiSuccessivi("InSede")
      ]),
      new MezzoInServizio(
      "54",
      "Tuscolano I",
      "M_53245   ABP",
      "53245",
      "InViaggio",
      new Date(),
      "134.333.222",
      true,
      "3/A",
      "A 12/06/2017",
       [
        new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Mario Bianchi", "Mariolino", true, false, false),
        new PersonaSulMezzo("BRNGSP78Y65T453R", "CS Giuseppe Bernardi", "Peppino", false, true, true),
        new PersonaSulMezzo("VRDGSP78Y65T453R", "CS Giacomo Verdi", "Giacomino", false, false, true),
        new PersonaSulMezzo("PLTGSP78Y65T453R", "CS Giuseppe Paoletti", "Giuseppino", false, false, false),
        new PersonaSulMezzo("RSSPAL78Y65T453R", "CS Paolo Rossi", "Paolino", false, false, false)
      ],
      [
       new StatiSuccessivi("InRientro"),
       new StatiSuccessivi("InSede")
      ])
     /* new MezzoInServizio(
      '12',
      'Centrale',
      'M_34564   APS',
      '34564',
      'SulPosto',
      new Date(2017, 5, 5, 10, 9, 20),
      '134.345.123',
      true,
      '1/C',
      'C new Date(2017, 5, 5, 8, 0, 0)',
      new Date(2017, 5, 5, 8, 0, 0),
      [
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Mario Bertolo", "Mariolino", true, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Marinucci", "Peppino", false, true),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giacomo Rossi", "Giacomino", false, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Rossetti", "Giuseppino", false, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Paolo Rossi", "Paolino", false, false)
      ]),
       new MezzoInServizio(
      '16',
      'Nomentano',
      'M_35564',
      'APS',
      '35564',
      'SulPosto',
      new Date(2017,5, 5, 9, 9, 20),
      '134.345.124',
      true,
      '4/A',
      'D',
      new Date(2017, 5, 5, 8, 0, 0),
      [
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giacomo Rossi", "Giacomino", false, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Rossetti", "Giuseppino", true, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Paolo Rossi", "Paolino", false, true)
      ]),
       new MezzoInServizio(
      '21',
      'Ostia',
      'M_74564',
      'APS',
      '74564',
      'InRientro',
      new Date(),
      '',
      true,
      '5/A',
      'D',
      new Date(),
      [
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Mario Bertolo", "Mariolino", true, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Marinucci", "Peppino", false, true),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giacomo Rossi", "Giacomino", false, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Rossetti", "Giuseppino", false, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Paolo Rossi", "Paolino", false, false)
      ]),
       new MezzoInServizio(
      '34',
      'Tuscolano II',
      'M_92564',
      'AS',
      '92564',
      'InRientro',
      new Date(2017,5, 5, 9, 20, 20),
      '',
      true,
      'AS-01',
      'D',
      new Date(2017, 5, 5, 8, 0, 0),
      [
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giacomo Rossi", "Giacomino", true, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Rossetti", "Giuseppino", false, true),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Paolo Rossi", "Paolino", false, false)
      ]),
       new MezzoInServizio(
      '14',
      'Frascati',
      'M_76564',
      'APS',
      '76564',
      'InRientro',
      new Date(2017,5, 5, 8, 10, 20),
      '',
      true,
      '5/A',
      'D',
      new Date(2017, 5, 5, 8, 0, 0),
      [
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Mario Bertolo", "Mariolino", true, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Marinucci", "Peppino", false, true),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giacomo Rossi", "Giacomino", false, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Rossetti", "Giuseppino", false, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Paolo Rossi", "Paolino", false, false)
      ]),
        new MezzoInServizio(
      '22',
      'Fiumicino',
      'M_36789',
      'AS',
      '36789',
      'Istituto',
      new Date(),
      '',
      true,
      'AS/2',
      'D',
      new Date(),
      [new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giacomo Rossi", "Giacomino", false, true),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Rossetti", "Giuseppino", true, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Paolo Rossi", "Paolino", false, false)
      ]),
       new MezzoInServizio(
      '41',
      'Centrale',
      'M_88934',
      'APS',
      '88934',
      'Istituto',
      new Date(),
      '',
      true,
      '6/C',
      'D',
      new Date(),
      [      new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Mario Bertolo", "Mariolino", true, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Marinucci", "Peppino", false, true),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giacomo Rossi", "Giacomino", false, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Giuseppe Rossetti", "Giuseppino", false, false),
       new PersonaSulMezzo("MNBHJU78Y65T453R", "CS Paolo Rossi", "Paolino", false, false)
       ]),
       new MezzoInServizio(
      '45',
      'Centrale',
      'M_34766',
      'APS',
      '34766',
      'InSede',
      new Date(),
      '',
      true,
      '',
      '',
      null,
      []),
       new MezzoInServizio(
      '11',
      'Centrale',
      'M_84564',
      'ABP',
      '84564',
      'InSede',
      new Date(),
      '',
      true,
      '',
      '',
      null,
      []),
      new MezzoInServizio(
      '18',
      'Nomentano',
      'M_34789',
      'APS',
      '34789',
      'InSede',
      new Date(),
      '',
      true,
       '',
      '',
      null,
      []),
       new MezzoInServizio(
      '31',
      'Fiumicino',
      'M_56411',
      'APS',
      '56411',
      'InSede',
      new Date(),
      '',
      true,
      '',
      '',
      null,
      []),
       new MezzoInServizio(
      '56',
      'Centrale',
      'M_67455',
      'APS',
      '67455',
      'FuoriServizio',
      new Date(2017, 5, 4, 10, 9, 20),
      '',
      false,
      '',
      '',
      null,
      []),
       new MezzoInServizio(
      '58',
      'Centrale',
      'M_76654',
      'APS',
      '76654',
      'FuoriServizio',
      new Date(2017, 5, 3, 10, 20, 20),
      '',
      false,
      '',
      '',
      null,  
      [])  */
  ];

  constructor() { }

  public getMezzi(): Observable<MezzoInServizio[]> {
    return Observable.of(this.mezzi);
  }

}
