import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { MezzoComposizione } from "../../../composizione-partenza/model/mezzo-composizione.model";
import { Componente } from '../../../shared/model/componente.model';
import { BoxPartenza } from '../../../composizione-partenza/model/box-partenza.model';



@Injectable({
  providedIn: 'root'
})
export class CompPartenzaServiceFake {
  preAccoppiati: BoxPartenza[];
  mezzi: MezzoComposizione[];
  squadre: Squadra[];

  constructor() {
  }

  public getPreAccoppiati(): Observable<BoxPartenza[]> {
    this.preAccoppiati = [
      new BoxPartenza(1,
        new MezzoComposizione(
          '1',
          new Mezzo('1', 'A1', 'APS', 'inSede', [], 0),
          '23.5 km',
          '35 min',
          'Tuscolana II'
        ),
        [
          new Squadra('Rossa', 'inSede', [
            new Componente('QF', 'Mario Verdi', '', true, false, false),
            new Componente('QF', 'Roberto Merlo', '', false, true, false),
            new Componente('QF', 'Francesca De Simone', '', false, false, false),
            new Componente('QF', 'Emanuele Catti', '', false, false, false),
            new Componente('QF', 'Mariangela Rossi', '', false, false, false),
          ])
        ]
      )
    ];

    return of(this.preAccoppiati);
  }

  public getMezziComposizione(): Observable<MezzoComposizione[]> {
    this.mezzi = [
      new MezzoComposizione(
        '1',
        new Mezzo('1',
          'A1',
          'APS',
          'inSede',
          [
          ],
          0
        ),
        '20.2 km',
        '20 min',
        'Tuscolana II'
      ),
      new MezzoComposizione(
        '2',
        new Mezzo('2',
          'A2',
          'APS',
          'inSede',
          [
          ],
          0
        ),
        '34.6 km',
        '43 min',
        'Tuscolana II'
      ),
      new MezzoComposizione(
        '3',
        new Mezzo('3',
          'A3',
          'APS',
          'inSede',
          [
          ],
          0
        ),
        '10.4 km',
        '16 min',
        'Tuscolano II'
      ),
    ];

    return of(this.mezzi);
  }

  public getSquadre(): Observable<Squadra[]> {
    this.squadre = [
      new Squadra('Rossa',
        'InSede',
        [
          new Componente('CP', 'Mario Rossi', '', true, false, false),
          new Componente('AA', 'Mario Rossi', '', false, false, false),
          new Componente('BB', 'Mario Rossi', '', false, false, false),
          new Componente('CC', 'Mario Rossi', '', false, false, false),
          new Componente('DD', 'Mario Rossi', '', false, false, false),
        ]
      ),
      new Squadra('Gialla',
        'InSede',
        [
          new Componente('CP', 'Francesco Verdi', '', true, false, false),
          new Componente('EE', 'Francesco Verdi', '', false, false, false),
          new Componente('FF', 'Francesco Verdi', '', false, false, false),
          new Componente('GG', 'Francesco Verdi', '', false, false, false),
        ]
      ),
      new Squadra('Verde',
        'InSede',
        [
          new Componente('CP', 'Francesco Verdi', '', true, false, false),
          new Componente('EE', 'Francesco Verdi', '', false, false, false),
          new Componente('FF', 'Francesco Verdi', '', false, false, false),
          new Componente('GG', 'Francesco Verdi', '', false, false, false),
        ]
      ),
    ];

    return of(this.squadre);
  }
}
