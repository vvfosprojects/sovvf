import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { MezzoComposizione } from '../../../features/home/composizione-partenza/interface/mezzo-composizione-interface';
import { Componente } from '../../../shared/model/componente.model';
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { Coordinate } from '../../../shared/model/coordinate.model';
import { Sede } from 'src/app/shared/model/sede.model';
import { SquadraComposizione } from 'src/app/features/home/composizione-partenza/interface/squadra-composizione-interface';



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
      {
        id: '1',
        mezzoComposizione: {
          id: '1',
          mezzo: {
            codice: '1',
            descrizione: 'A1',
            genere: 'APS',
            stato: 'inSede',
            appartenenza: 0,
            distaccamento: {
              codice: '1',
              descrizione: 'Tuscolano II',
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
        },
        squadraComposizione: [
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
          }
        ],
        selezionato: false,
        hover: false
      },
      {
        id: '2',
        mezzoComposizione: {
          id: '2',
          mezzo: {
            codice: '2',
            descrizione: 'A2',
            genere: 'APS',
            stato: 'inSede',
            appartenenza: 0,
            distaccamento: {
              codice: '1',
              descrizione: 'Tuscolano II',
              coordinate: { latitudine: 1, longitudine: 1 },
              indirizzo: 'Via Prova, 2',
              tipo: 'Distaccamento',
              regione: 'Lazio',
              provincia: 'Roma'
            }
          },
          km: '25.6 km',
          tempoPercorrenza: '26 min',
          coordinate: {
            latitudine: 41.82699,
            longitudine: 12.4879854,
          },
          selezionato: false,
          hover: false
        },
        squadraComposizione: [
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
        ],
        selezionato: false,
        hover: false
      },
      {
        id: '3',
        mezzoComposizione: {
          id: '3',
          mezzo: {
            codice: '3',
            descrizione: 'A3',
            genere: 'APS',
            stato: 'inSede',
            appartenenza: 0,
            distaccamento: {
              codice: '1',
              descrizione: 'Ostiense',
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
        },
        squadraComposizione: [
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
        ],
        selezionato: false,
        hover: false
      },
      {
        id: '4',
        mezzoComposizione: {
          id: '1',
          mezzo: {
            codice: '1',
            descrizione: 'A1',
            genere: 'APS',
            stato: 'inSede',
            appartenenza: 0,
            distaccamento: {
              codice: '1',
              descrizione: 'Tuscolana I',
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
        },
        squadraComposizione: [
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
          }
        ],
        selezionato: false,
        hover: false
      },
      {
        id: '5',
        mezzoComposizione: {
          id: '2',
          mezzo: {
            codice: '2',
            descrizione: 'A2',
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
          km: '25.6 km',
          tempoPercorrenza: '26 min',
          coordinate: {
            latitudine: 41.82699,
            longitudine: 12.4879854,
          },
          selezionato: false,
          hover: false
        },
        squadraComposizione: [
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
        ],
        selezionato: false,
        hover: false
      },
      {
        id: '6',
        squadraComposizione: [
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
        ],
        selezionato: false,
        hover: false
      },
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
            descrizione: 'Tuscolano II',
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
      },
      {
        id: '2',
        mezzo: {
          codice: '2',
          descrizione: 'A2',
          genere: 'APS',
          stato: 'inSede',
          appartenenza: 0,
          distaccamento: {
            codice: '1',
            descrizione: 'Tuscolano II',
            coordinate: { latitudine: 1, longitudine: 1 },
            indirizzo: 'Via Prova, 2',
            tipo: 'Distaccamento',
            regione: 'Lazio',
            provincia: 'Roma'
          }
        },
        km: '25.6 km',
        tempoPercorrenza: '26 min',
        coordinate: {
          latitudine: 41.82699,
          longitudine: 12.4879854,
        },
        selezionato: false,
        hover: false
      },
      {
        id: '3',
        mezzo: {
          codice: '3',
          descrizione: 'A3',
          genere: 'APS',
          stato: 'inSede',
          appartenenza: 0,
          distaccamento: {
            codice: '1',
            descrizione: 'Tuscolano II',
            coordinate: { latitudine: 1, longitudine: 1 },
            indirizzo: 'Via Prova, 2',
            tipo: 'Distaccamento',
            regione: 'Lazio',
            provincia: 'Roma'
          }
        },
        km: '27.4 km',
        tempoPercorrenza: '28 min',
        coordinate: {
          latitudine: 41.8531486,
          longitudine: 12.5418702
        },
        selezionato: false,
        hover: false
      },
      {
        id: '4',
        mezzo: {
          codice: '4',
          descrizione: 'A4',
          genere: 'APS',
          stato: 'inRientro',
          appartenenza: 0,
          distaccamento: {
            codice: '1',
            descrizione: 'Tuscolano II',
            coordinate: { latitudine: 1, longitudine: 1 },
            indirizzo: 'Via Prova, 2',
            tipo: 'Distaccamento',
            regione: 'Lazio',
            provincia: 'Roma'
          }
        },
        km: '30.1 km',
        tempoPercorrenza: '31.5 min',
        coordinate: {
          latitudine: 41.8935662,
          longitudine: 12.5417044
        },
        selezionato: false,
        hover: false
      },
      {
        id: '5',
        mezzo: {
          codice: '5',
          descrizione: 'A5',
          genere: 'APS',
          stato: 'inRientro',
          appartenenza: 0,
          distaccamento: {
            codice: '1',
            descrizione: 'Ostiense',
            coordinate: { latitudine: 1, longitudine: 1 },
            indirizzo: 'Via Prova, 2',
            tipo: 'Distaccamento',
            regione: 'Lazio',
            provincia: 'Roma'
          }
        },
        km: '32.1 km',
        tempoPercorrenza: '33 min',
        coordinate: {
          latitudine: 41.8311007,
          longitudine: 12.4686518
        },
        selezionato: false,
        hover: false
      },
      {
        id: '6',
        mezzo: {
          codice: '6',
          descrizione: 'A6',
          genere: 'APS',
          stato: 'inViaggio',
          appartenenza: 0,
          distaccamento: {
            codice: '1',
            descrizione: 'Ostiense',
            coordinate: { latitudine: 1, longitudine: 1 },
            indirizzo: 'Via Prova, 2',
            tipo: 'Distaccamento',
            regione: 'Lazio',
            provincia: 'Roma'
          }
        },
        km: '34.7 km',
        tempoPercorrenza: '35 min',
        coordinate: {
          latitudine: 41.8311007,
          longitudine: 12.4686518
        },
        selezionato: false,
        hover: false
      },
      {
        id: '7',
        mezzo: {
          codice: '7',
          descrizione: 'A7',
          genere: 'APS',
          stato: 'sulPosto',
          appartenenza: 0,
          distaccamento: {
            codice: '1',
            descrizione: 'Ostiense',
            coordinate: { latitudine: 1, longitudine: 1 },
            indirizzo: 'Via Prova, 2',
            tipo: 'Distaccamento',
            regione: 'Lazio',
            provincia: 'Roma'
          }
        },
        km: '34.9 km',
        tempoPercorrenza: '35.5 min',
        coordinate: {
          latitudine: 41.8311007,
          longitudine: 12.4686518
        },
        selezionato: false,
        hover: false
      },
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
      {
        id: '3',
        squadra: {
          nome: 'Arancione',
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
