import { Component, OnInit, Input } from '@angular/core';
import { VoceFiltro } from '../filtri-richieste/voce-filtro.model';
import { RicercaRichiesteService } from './ricerca-richieste-service/ricerca-richieste.service';
import { Observable } from 'rxjs';
import { FiltriRichiesteState } from '../filtri-richieste/store/states/filtri-richieste.state';
import { Select } from '@ngxs/store';

@Component({
    selector: 'app-ricerca-richieste',
    templateUrl: './ricerca-richieste.component.html',
    styleUrls: ['./ricerca-richieste.component.scss']
})
export class RicercaRichiesteComponent implements OnInit {
    @Select(FiltriRichiesteState.filtriTipologie) filtri$: Observable<VoceFiltro[]>;
    filtri: VoceFiltro[];

    searchText: string;
    filtriSelezionatiBySearch: VoceFiltro[] = [];

    stringaRicerca = { descrizione: '' };

    constructor(public ricercaS: RicercaRichiesteService) {
    }

    ngOnInit() {
    }

    search(stringa: string) {
        this.stringaRicerca.descrizione = stringa;
        this.ricercaS.sendRicerca(this.stringaRicerca);
    }
}
