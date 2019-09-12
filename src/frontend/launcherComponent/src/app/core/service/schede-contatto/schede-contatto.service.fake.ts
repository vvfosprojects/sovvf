import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { Store } from '@ngxs/store';
import { SetListaSchedeContatto } from 'src/app/features/home/store/actions/schede-contatto/schede-contatto.actions';
import { Priorita } from 'src/app/shared/model/sintesi-richiesta.model';


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
                'id': '1',
                'categoria': 'Incendio',
                'classificazioneEvento': 'Incendio Boschivo',
                'competenzaCC_PS': 'Distaccamento di Tuscolana',
                'dataInserimento': new Date(),
                'dettaglio': 'Ulteriori informazioni',
                'localita': {
                    'coordinate': {
                        'latitudine': 41.9005719,
                        'longitudine': 12.4971768
                    },
                    'indirizzo': 'Via Cavour 5, Roma',
                    'note': 'Note indirizzo',
                    'piano': '2'
                },
                'priorita': Priorita.Alta,
                'numeroPersoneCoinvolte': 2,
                'richiedente': {
                    'nominativo': 'Mario Rossi',
                    'telefono': '3208796523'
                }
            },
            {
                'id': '2',
                'categoria': 'Allagamento',
                'classificazioneEvento': 'Allagamento Cantina',
                'competenzaCC_PS': 'Distaccamento di Ostiense',
                'dataInserimento': new Date(),
                'dettaglio': 'Ulteriori informazioni',
                'localita': {
                    'coordinate': {
                        'latitudine': 1,
                        'longitudine': 2
                    },
                    'indirizzo': 'Via Roma, 65b',
                    'note': 'Note indirizzo',
                    'piano': '2'
                },
                'priorita': Priorita.Media,
                'numeroPersoneCoinvolte': 1,
                'richiedente': {
                    'nominativo': 'Francesco Verdi',
                    'telefono': '3348761547'
                }
            }
        ];

        this.store.dispatch(new SetListaSchedeContatto(this.listaSchede));
        return of(this.listaSchede);
    }
}
