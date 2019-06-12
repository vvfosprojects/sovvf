import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetFiltriComposizione } from '../../../../features/home/store/actions/composizione-partenza/filterbar-composizione.actions';

@Injectable()
export class FilterbarServiceFake {

    filtri: any;

    constructor(private store: Store) {
    }

    getFiltri(): Observable<any> {
        this.filtri = {
            'distaccamenti': [
                {
                    'id': '1',
                    'descrizione': 'Roma'
                },
                {
                    'id': '2',
                    'descrizione': 'Frosinone'
                },
                {
                    'id': '3',
                    'descrizione': 'Latina'
                },
                {
                    'id': '4',
                    'descrizione': 'Rieti'
                }
            ],
            'generiMezzi': [
                {
                    'id': '1',
                    'descrizione': 'APS'
                },
                {
                    'id': '2',
                    'descrizione': 'ABP'
                },
                {
                    'id': '3',
                    'descrizione': 'AG'
                },
                {
                    'id': '4',
                    'descrizione': 'AS'
                }
            ],
            'stati': [
                {
                    'id': '1',
                    'descrizione': 'In Sede'
                },
                {
                    'id': '2',
                    'descrizione': 'In Rientro'
                },
                {
                    'id': '3',
                    'descrizione': 'In Viaggio'
                },
                {
                    'id': '4',
                    'descrizione': 'Sul Posto'
                }
            ]
        };

        this.store.dispatch(new SetFiltriComposizione(this.filtri));
        return of(null);
    }
}
