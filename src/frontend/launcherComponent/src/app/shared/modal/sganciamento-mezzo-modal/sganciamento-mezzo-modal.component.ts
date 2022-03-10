import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';
import { RichiestaSganciamentoState } from '../../../features/home/store/states/composizione-partenza/richiesta-sganciamento.state';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { ActionMezzo } from '../../../features/home/store/actions/richieste/richieste.actions';
import { RichiesteState } from '../../../features/home/store/states/richieste/richieste.state';

@Component({
    selector: 'app-sganciamento-mezzo-modal',
    templateUrl: './sganciamento-mezzo-modal.component.html',
    styleUrls: ['./sganciamento-mezzo-modal.component.css']
})
export class SganciamentoMezzoModalComponent implements OnDestroy {

    @Select(RichiesteState.loadingActionMezzo) loadingActionMezzo$: Observable<string[]>;
    @Select(RichiestaSganciamentoState.richiestaSganciamento) richiestaSganciamento$: Observable<SintesiRichiesta>;
    richiestaSganciamento: SintesiRichiesta;
    idDaSganciare: string;

    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    private subscriptions: Subscription = new Subscription();

    constructor(public modal: NgbActiveModal,
                private store: Store) {
        this.getRichiestaSganciamento();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getRichiestaSganciamento(): void {
        this.subscriptions.add(
            this.richiestaSganciamento$.subscribe((richiestaSganciamento: SintesiRichiesta) => {
                this.richiestaSganciamento = richiestaSganciamento;
            })
        );
    }

    onActionMezzo(actionMezzo: MezzoActionInterface): void {
        this.store.dispatch(new ActionMezzo(actionMezzo));
    }
}
