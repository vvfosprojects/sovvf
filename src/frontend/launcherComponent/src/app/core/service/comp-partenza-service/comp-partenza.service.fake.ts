import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { MezzoComposizione } from '../../../composizione-partenza/model/mezzo-composizione.model';
import { Componente } from '../../../shared/model/componente.model';
import { BoxPartenza } from '../../../composizione-partenza/model/box-partenza.model';
import { Coordinate } from '../../../shared/model/coordinate.model';



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
          'Tuscolana II',
            new Coordinate(41.8311007, 12.4686518)
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
      ),
      new BoxPartenza(2,
        new MezzoComposizione(
          '2',
          new Mezzo('2', 'A2', 'APS', 'inSede', [], 0),
          '23.5 km',
          '35 min',
          'Tuscolana II',
            new Coordinate(41.82699, 12.4879854)
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
      ),
      new BoxPartenza(3,
        new MezzoComposizione(
          '3',
          new Mezzo('3', 'A3', 'APS', 'inSede', [], 0),
          '23.5 km',
          '35 min',
          'Tuscolana II',
            new Coordinate(41.8531486, 12.5418702)
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
      ),
      new BoxPartenza(4,
        new MezzoComposizione(
          '4',
          new Mezzo('4', 'A1', 'APS', 'inSede', [], 0),
          '23.5 km',
          '35 min',
          'Tuscolana II',
            new Coordinate(41.8935662, 12.5417044)
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
      ),
      new BoxPartenza(5,
        new MezzoComposizione(
          '5',
          new Mezzo('5', 'A5', 'APS', 'inSede', [], 0),
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
      ),
      new BoxPartenza(6,
        new MezzoComposizione(
          '6',
          new Mezzo('6', 'A6', 'APS', 'inSede', [], 0),
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
      ),
      new BoxPartenza(7,
        new MezzoComposizione(
          '7',
          new Mezzo('7', 'A7', 'APS', 'inSede', [], 0),
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
      ),
      new BoxPartenza(8,
        new MezzoComposizione(
          '8',
          new Mezzo('8', 'A8', 'APS', 'inSede', [], 0),
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
      ),
      new BoxPartenza(9,
        new MezzoComposizione(
          '9',
          new Mezzo('9', 'A9', 'APS', 'inSede', [], 0),
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
      ),
      new BoxPartenza(10,
        new MezzoComposizione(
          '10',
          new Mezzo('10', 'A10', 'APS', 'inSede', [], 0),
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
      ),
      new BoxPartenza(11,
        new MezzoComposizione(
          '11',
          new Mezzo('11', 'A11', 'APS', 'inSede', [], 0),
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
      ),
      new BoxPartenza(12,
        new MezzoComposizione(
          '12',
          new Mezzo('12', 'A12', 'APS', 'inSede', [], 0),
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
      ),
      new BoxPartenza(13,
        new MezzoComposizione(
          '13',
          new Mezzo('13', 'A13', 'APS', 'inSede', [], 0),
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
      ),
      new BoxPartenza(14,
        new MezzoComposizione(
          '14',
          new Mezzo('14', 'A14', 'APS', 'inSede', [], 0),
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
      ),
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
        'Tuscolana II',
          new Coordinate(41.8311007, 12.4686518),
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
        'Tuscolana II',
          new Coordinate(41.82699, 12.4879854),
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
        'Tuscolano II',
          new Coordinate(41.8531486, 12.5418702),
      ),
      new MezzoComposizione(
        '4',
        new Mezzo('4',
          'A4',
          'APS',
          'inSede',
          [
          ],
          0
        ),
        '10.4 km',
        '16 min',
        'Tuscolano II',
          new Coordinate(41.8935662, 12.5417044),
      ),
      new MezzoComposizione(
        '5',
        new Mezzo('5',
          'A5',
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
      new MezzoComposizione(
        '6',
        new Mezzo('6',
          'A6',
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
      new MezzoComposizione(
        '7',
        new Mezzo('7',
          'A7',
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
      new Squadra('Arancione',
        'InSede',
        [
          new Componente('CP', 'Francesco Verdi', '', true, false, false),
          new Componente('EE', 'Francesco Verdi', '', false, false, false),
          new Componente('FF', 'Francesco Verdi', '', false, false, false),
          new Componente('GG', 'Francesco Verdi', '', false, false, false),
        ]
      ),
      new Squadra('Viola',
        'InSede',
        [
          new Componente('CP', 'Francesco Verdi', '', true, false, false),
          new Componente('EE', 'Francesco Verdi', '', false, false, false),
          new Componente('FF', 'Francesco Verdi', '', false, false, false),
          new Componente('GG', 'Francesco Verdi', '', false, false, false),
        ]
      ),
      new Squadra('Nera',
        'InSede',
        [
          new Componente('CP', 'Francesco Verdi', '', true, false, false),
          new Componente('EE', 'Francesco Verdi', '', false, false, false),
          new Componente('FF', 'Francesco Verdi', '', false, false, false),
          new Componente('GG', 'Francesco Verdi', '', false, false, false),
        ]
      ),
      new Squadra('Marrone',
        'InSede',
        [
          new Componente('CP', 'Francesco Verdi', '', true, false, false),
          new Componente('EE', 'Francesco Verdi', '', false, false, false),
          new Componente('FF', 'Francesco Verdi', '', false, false, false),
          new Componente('GG', 'Francesco Verdi', '', false, false, false),
        ]
      ),
      new Squadra('Marrone',
        'InSede',
        [
          new Componente('CP', 'Francesco Verdi', '', true, false, false),
          new Componente('EE', 'Francesco Verdi', '', false, false, false),
          new Componente('FF', 'Francesco Verdi', '', false, false, false),
          new Componente('GG', 'Francesco Verdi', '', false, false, false),
        ]
      ),
      new Squadra('Marrone',
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
