import { Component, EventEmitter, Input, isDevMode, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MezzoActionInterface } from '../../../../../../shared/interface/mezzo-action.interface';
import { SintesiRichiesta } from '../../../../../../shared/model/sintesi-richiesta.model';
import { Store } from '@ngxs/store';
import { ActionMezzo } from '../../../../store/actions/richieste/richieste.actions';

@Component({
    selector: 'app-sintesi-richiesta-modal',
    templateUrl: './sintesi-richiesta-modal.component.html',
    styleUrls: ['./sintesi-richiesta-modal.component.css']
})
export class SintesiRichiestaModalComponent implements OnInit {

    @Input() richiesta: SintesiRichiesta;
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();

    constructor(public modal: NgbActiveModal, private store: Store) {
    }

    ngOnInit() {
        isDevMode() && console.log('Richiesta Modal', this.richiesta);
    }

    onActionMezzo(actionMezzo: MezzoActionInterface) {
        this.store.dispatch(new ActionMezzo(actionMezzo));
    }

}
