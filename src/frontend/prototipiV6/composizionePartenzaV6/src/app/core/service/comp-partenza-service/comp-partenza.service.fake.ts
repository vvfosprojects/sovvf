import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { MezzoComposizione } from '../../../composizione-partenza/interface/composizione-partenza-interface';
import { Componente } from '../../../shared/model/componente.model';
import { BoxPartenza } from '../../../composizione-partenza/model/box-partenza.model';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { Sede } from 'src/app/shared/model/sede.model';



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
    ];

    return of(this.preAccoppiati);
  }

  public getMezziComposizione(): Observable<MezzoComposizione[]> {
    this.mezzi = [
      {
        id: '1',
        mezzo: {
          codice: '1',
          descrizione: 'A1',
          genere: 'APS',
          stato: 'inSede',
          appartenenza: 0,
          distaccamento: {
            codice: '1',
            descrizione: 'Tuscolana II',
            coordinate: { latitudine: 1, longitudine: 1 },
            indirizzo: 'Via Prova, 2',
            tipo: 'Distaccamento',
            regione: 'Lazio',
            provincia: 'Roma'
          }
        },
        km: '20.2 km',
        tempoPercorrenza: '20 min',
        coordinate: {
          latitudine: 41.8311007,
          longitudine: 12.4686518
        },
        selezionato: false,
        hover: false
      }
    ];

    return of(this.mezzi);
  }

  public getSquadre(): Observable<Squadra[]> {
    this.squadre = [
      new Squadra(
        'Rossa',
        'inSede',
        [
          new Componente('CP', 'Mario Verdi', '', true, false, false),
          new Componente('AUT', 'Mario Rossi', '', false, true, false),
          new Componente('AA', 'Francesco Cali', '', false, false, false),
        ],
        new Sede('1',
          'Tuscolana II',
          new Coordinate(1, 1),
          'Via Prova, 1',
          'Distaccamento',
          'Lazio',
          'Roma'
        )
      )
    ];

    return of(this.squadre);
  }
}
