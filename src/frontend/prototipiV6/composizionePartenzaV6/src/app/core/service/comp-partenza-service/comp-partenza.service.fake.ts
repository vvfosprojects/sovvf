import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { MezzoComposizione } from '../../../composizione-partenza/interface/mezzo-composizione-interface';
import { Componente } from '../../../shared/model/componente.model';
import { BoxPartenza } from '../../../composizione-partenza/interface/box-partenza-interface';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { Sede } from 'src/app/shared/model/sede.model';
import { SquadraComposizione } from 'src/app/composizione-partenza/interface/squadra-composizione-interface';



@Injectable({
  providedIn: 'root'
})
export class CompPartenzaServiceFake {
  preAccoppiati: BoxPartenza[];
  mezzi: MezzoComposizione[];
  squadre: SquadraComposizione[];

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

  public getSquadre(): Observable<SquadraComposizione[]> {
    this.squadre = [
      {
        id: '1',
        squadra: {
          nome: 'Rossa',
          stato: 'inSede',
          componenti: [
            { descrizioneQualifica: 'CP', nominativo: 'Mario Verdi', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
            { descrizioneQualifica: 'CP', nominativo: 'Francesco Rossi', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
            { descrizioneQualifica: 'CP', nominativo: 'Mario Verna', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
          ],
          distaccamento: {
            codice: '1',
            descrizione: 'Tuscolana II',
            coordinate: { latitudine: 1, longitudine: 1 },
            indirizzo: 'Via Prova, 1',
            tipo: 'Distaccamento',
            regione: 'Lazio',
            provincia: 'Roma'
          }
        },
        selezionato: false,
        hover: false
      },
      {
        id: '2',
        squadra: {
          nome: 'Verde',
          stato: 'inSede',
          componenti: [
            { descrizioneQualifica: 'CP', nominativo: 'Paolo Marchio', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
            { descrizioneQualifica: 'CP', nominativo: 'Francesca Ventura', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
            { descrizioneQualifica: 'CP', nominativo: 'Federico Calu', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
          ],
          distaccamento: {
            codice: '1',
            descrizione: 'Tuscolana II',
            coordinate: { latitudine: 1, longitudine: 1 },
            indirizzo: 'Via Prova, 1',
            tipo: 'Distaccamento',
            regione: 'Lazio',
            provincia: 'Roma'
          }
        },
        selezionato: false,
        hover: false
      },
    ];

    return of(this.squadre);
  }
}
