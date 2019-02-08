import { Component, OnInit, Input } from '@angular/core';
import { VoceFiltro } from '../filtri-richieste/voce-filtro.model';
import { Observable } from 'rxjs';
import { FiltriRichiesteState } from '../filtri-richieste/store/';
import { Select, Store } from '@ngxs/store';
import { SetRicerca } from './store/actions/ricerca-richieste.actions';
import { RicercaRichiesteState } from './store/';

@Component({
    selector: 'app-ricerca-richieste',
    templateUrl: './ricerca-richieste.component.html',
    styleUrls: ['./ricerca-richieste.component.scss']
})
export class RicercaRichiesteComponent implements OnInit {
    @Select(FiltriRichiesteState.filtriTipologie) filtri$: Observable<VoceFiltro[]>;
    @Select(RicercaRichiesteState.ricerca) ricerca$: Observable<any>;

    ricerca = { descrizione: '' };

    constructor(private store: Store) {
    }

    ngOnInit() {
    }

    search() {
        this.store.dispatch(new SetRicerca(copyObj(this.ricerca)));

        function copyObj(obj: any) {
            return JSON.parse(JSON.stringify(obj));
        }
    }

}
