import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MezzoActionInterface } from '../../../../../../shared/interface/mezzo-action.interface';
import { SintesiRichiesta } from '../../../../../../shared/model/sintesi-richiesta.model';
import { Select, Store } from '@ngxs/store';
import { ActionMezzo, ClearRichiestaById } from '../../../../store/actions/richieste/richieste.actions';
import { Observable, Subscription } from 'rxjs';
import { RichiesteState } from '../../../../store/states/richieste/richieste.state';

@Component({
    selector: 'app-sintesi-richiesta-modal',
    templateUrl: './sintesi-richiesta-modal.component.html',
    styleUrls: ['./sintesi-richiesta-modal.component.css']
})
export class SintesiRichiestaModalComponent implements OnInit, OnDestroy {

    @Select(RichiesteState.getRichiestaById) sintesiRichiesta$: Observable<SintesiRichiesta>;
    sintesiRichiesta: SintesiRichiesta = null;

    private subscription = new Subscription();

    constructor(public modal: NgbActiveModal, private store: Store) {
        this.subscription.add(this.sintesiRichiesta$.subscribe(sintesi => this.sintesiRichiesta = sintesi));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Sintesi Richiesta Modal creato');
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearRichiestaById());
        isDevMode() && console.log('Componente Sintesi Richiesta Modal distrutto');
    }

    onActionMezzo(actionMezzo: MezzoActionInterface) {
        this.store.dispatch(new ActionMezzo(actionMezzo));
    }

}
