import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { Store } from '@ngxs/store';
import { SetListaSchedeContatto } from 'src/app/features/home/store/actions/schede-contatto/schede-contatto.actions';
import { ClassificazioneSchedaContatto } from '../../../shared/enum/classificazione-scheda-contatto.enum';

@Injectable({
  providedIn: 'root'
})
export class SchedeContattoServiceFake {

  listaSchede: SchedaContatto[];

  constructor(private store: Store) {
  }

  getSchedeContatto(): Observable<SchedaContatto[]> {
    this.listaSchede = [
      {
        'codiceScheda': '1',
        'dataInserimento': new Date('2019-09-05T08:00:00'),
        'richiedente': {
          'telefono': '113',
          'nominativo': 'Polizia'
        },
        'localita': {
          'coordinate': {
            'latitudine': 41.908101,
            'longitudine': 12.549783
          },
          'indirizzo': 'Via Yambo, 00159 Roma RM, Italia',
          'note': null,
          'piano': null
        },
        'classificazioneEvento': 'Incendio Albero',
        'categoria': '',
        'enteCompetenza': 'VVF',
        'dettaglio': '',
        'priorita': 3,
        'numeroPersoneCoinvolte': '2',
        'operatoreChiamata': {
          'codiceSede': 'RM.1000',
          'codicePostazioneOperatore': '10',
          'codiceFiscale': 'ABCD10'
        },
        'classificazione': ClassificazioneSchedaContatto.Competenza,
        'gestita': false
      },
      {
        'codiceScheda': '2',
        'dataInserimento': new Date('2019-09-05T08:00:00'),
        'richiedente': {
          'telefono': '113',
          'nominativo': 'Polizia'
        },
        'localita': {
          'coordinate': {
            'latitudine': 41.908101,
            'longitudine': 12.549783
          },
          'indirizzo': 'Via Yambo, 00159 Roma RM, Italia',
          'note': null,
          'piano': null
        },
        'classificazioneEvento': 'Incendio Albero',
        'categoria': '',
        'enteCompetenza': 'VVF',
        'dettaglio': '',
        'priorita': 3,
        'numeroPersoneCoinvolte': '2',
        'operatoreChiamata': {
          'codiceSede': 'RM.1000',
          'codicePostazioneOperatore': '10',
          'codiceFiscale': 'ABCD10'
        },
        'classificazione': ClassificazioneSchedaContatto.Conoscenza,
        'gestita': false
      },
      {
        'codiceScheda': '3',
        'dataInserimento': new Date('2019-09-05T08:00:00'),
        'richiedente': {
          'telefono': '113',
          'nominativo': 'Polizia'
        },
        'localita': {
          'coordinate': {
            'latitudine': 41.908101,
            'longitudine': 12.549783
          },
          'indirizzo': 'Via Yambo, 00159 Roma RM, Italia',
          'note': null,
          'piano': null
        },
        'classificazioneEvento': 'Incendio Albero',
        'categoria': '',
        'enteCompetenza': 'VVF',
        'dettaglio': '',
        'priorita': 3,
        'numeroPersoneCoinvolte': '2',
        'operatoreChiamata': {
          'codiceSede': 'RM.1000',
          'codicePostazioneOperatore': '10',
          'codiceFiscale': 'ABCD10'
        },
        'classificazione': ClassificazioneSchedaContatto.Differibile,
        'gestita': false
      }
    ];

    this.store.dispatch(new SetListaSchedeContatto(this.listaSchede));
    return of(this.listaSchede);
  }

  setSchedaContattoLetta() {
    return;
  }

  setSchedaContattoGestita() {
    return;
  }
}
