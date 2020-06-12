import { Component, OnDestroy, OnInit } from '@angular/core';
import { VoceFiltro } from '../voce-filtro.model';
import { Select, Store } from '@ngxs/store';
import { FiltriRichiesteState } from '../../../store/states/filterbar/filtri-richieste.state';
import { Observable, Subscription } from 'rxjs';
import {
    ClearAllFiltriTipologiaSelezionatiRichieste,
    ClearFiltroTipologiaSelezionatoRichieste,
    SetFiltroTipologiaSelezionatoRichieste
} from '../../../store/actions/filterbar/filtri-richieste.actions';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal-filtri-tipologia',
    templateUrl: './modal-filtri-tipologia.component.html',
    styleUrls: ['./modal-filtri-tipologia.component.css']
})
export class ModalFiltriTipologiaComponent implements OnInit, OnDestroy {

    @Select(FiltriRichiesteState.categoriaFiltriTipologie) categoriaFiltriRichieste$: Observable<string[]>;
    categorie: string[];
    @Select(FiltriRichiesteState.filtriTipologie) filtriRichieste$: Observable<VoceFiltro[]>;
    filtri: VoceFiltro[];
    @Select(FiltriRichiesteState.filtriTipologiaSelezionati) filtriTipologiaSelezionati$: Observable<VoceFiltro[]>;
    filtriSelezionati: VoceFiltro[];

    categoriaSelezionata: string;
    filtersSearch: { descrizione: string };
    p: number;

    subscription: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private store: Store) {
        this.initSearch();
        this.getCategorie();
        this.getFiltri();
        this.getFiltriSelezionati();
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    initSearch() {
        this.filtersSearch = { descrizione: '' };
    }

    getCategorie() {
        this.subscription.add(
            this.categoriaFiltriRichieste$.subscribe((categorie: string[]) => {
                this.categorie = categorie;
                this.categoriaSelezionata = this.categorie[0];
            })
        );
    }

    getFiltri() {
        this.subscription.add(
            this.filtriRichieste$.subscribe((filtri: VoceFiltro[]) => {
                this.filtri = filtri;
            })
        );
    }

    getFiltriSelezionati() {
        this.subscription.add(
            this.filtriTipologiaSelezionati$.subscribe((filtriSelezionati: VoceFiltro[]) => {
                this.filtriSelezionati = filtriSelezionati;
            })
        );
    }

    onSelezioneCategoria(categoria: any) {
        this.categoriaSelezionata = categoria;
    }

    onSelezioneFiltroTipologia(filtro: VoceFiltro) {
        this.store.dispatch(new SetFiltroTipologiaSelezionatoRichieste(filtro));
    }

    onDeselezioneFiltroTipologia(filtro: VoceFiltro) {
        this.store.dispatch(new ClearFiltroTipologiaSelezionatoRichieste(filtro));
    }

    chiudiModalFiltriTipologia(closeRes: string) {
        this.modal.close(closeRes);
    }

    resetFiltri() {
        this.store.dispatch(new ClearAllFiltriTipologiaSelezionatiRichieste());
    }
}
