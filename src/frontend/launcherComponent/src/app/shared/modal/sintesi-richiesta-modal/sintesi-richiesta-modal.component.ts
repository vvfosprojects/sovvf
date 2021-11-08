import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { Select, Store } from '@ngxs/store';
import { ActionMezzo, ClearRichiestaById } from '../../../features/home/store/actions/richieste/richieste.actions';
import { Observable, Subscription } from 'rxjs';
import { RichiesteState } from '../../../features/home/store/states/richieste/richieste.state';

@Component({
    selector: 'app-sintesi-richiesta-modal',
    templateUrl: './sintesi-richiesta-modal.component.html',
    styleUrls: ['./sintesi-richiesta-modal.component.css']
})
export class SintesiRichiestaModalComponent implements OnInit, OnDestroy {

    @Select(RichiesteState.getRichiestaById) sintesiRichiesta$: Observable<SintesiRichiesta>;
    sintesiRichiesta: SintesiRichiesta = null;

    private subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private store: Store) {
        this.getSintesiRichiesta();
    }

    ngOnInit(): void {
        console.log('Componente Sintesi Richiesta Modal creato');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearRichiestaById());
        console.log('Componente Sintesi Richiesta Modal distrutto');
    }

    getSintesiRichiesta(): void {
        this.subscription.add(
            this.sintesiRichiesta$.subscribe((richiesta: SintesiRichiesta) => {
                this.sintesiRichiesta = richiesta;
            })
        );
    }

    onActionMezzo(actionMezzo: MezzoActionInterface): void {
        this.store.dispatch(new ActionMezzo(actionMezzo));
    }

    close(type: string): void {
        this.modal.close(type);
    }

}
