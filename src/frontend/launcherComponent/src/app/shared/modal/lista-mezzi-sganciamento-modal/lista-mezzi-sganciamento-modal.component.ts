import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { ClearListaMezziSganciamento, GetListaMezziSganciamento } from '../../store/actions/sganciamento-mezzi/sganciamento-mezzi.actions';
import { Observable, Subscription } from 'rxjs';
import { SganciamentoMezziState } from '../../store/states/sganciamento-mezzi/sganciamento-mezzi.state';
import { MezzoInServizio } from '../../interface/mezzo-in-servizio.interface';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { Mezzo } from '../../model/mezzo.model';
import { SganciamentoMezzoComposizione } from '../../store/actions/mezzi-composizione/mezzi-composizione.actions';
import { SganciamentoInterface } from '../../interface/sganciamento.interface';

@Component({
    selector: 'app-lista-mezzi-sganciamento-modal',
    templateUrl: './lista-mezzi-sganciamento-modal.component.html',
    styleUrls: ['./lista-mezzi-sganciamento-modal.component.css']
})
export class ListaMezziSganciamentoModalComponent implements OnInit, OnDestroy {

    @Select(SganciamentoMezziState.mezzi) mezzi$: Observable<MezzoInServizio[]>;
    mezzi: MezzoInServizio[];
    @Select(SganciamentoMezziState.loadingMezzi) loadingMezzi$: Observable<boolean>;
    loadingMezzi: boolean;

    richiesta: SintesiRichiesta;

    private subscriptions: Subscription = new Subscription();

    constructor(public modalService: NgbModal,
                public modal: NgbActiveModal,
                private store: Store) {
        this.getLoading();
    }

    ngOnInit(): void {
        this.getListaMezziSganciamento();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.store.dispatch(new ClearListaMezziSganciamento());
    }

    getListaMezziSganciamento(): void {
        this.store.dispatch(new GetListaMezziSganciamento());
        this.subscriptions.add(
            this.mezzi$.subscribe((mezzi: MezzoInServizio[]) => {
                const mezziFiltered = mezzi?.length ? mezzi.filter((m: MezzoInServizio) => m.mezzo.mezzo.idRichiesta !== this.richiesta.codice) : null;
                this.mezzi = mezziFiltered;
            })
        );
    }

    getLoading(): void {
        this.subscriptions.add(
            this.loadingMezzi$.subscribe((loading: boolean) => {
                this.loadingMezzi = loading;
            })
        );
    }

    onSganciamento(mezzo: Mezzo): void {
        const objSganciamento = {
            idRichiesta: this.richiesta.codice,
            idRichiestaDaSganciare: mezzo.idRichiesta,
            idMezzoDaSganciare: mezzo.codice,
            descrizione: mezzo.descrizione
        } as SganciamentoInterface;
        this.store.dispatch(new SganciamentoMezzoComposizione(objSganciamento));
        this.close('ok');
    }

    close(esito: string): void {
        this.modal.close(esito);
    }
}
