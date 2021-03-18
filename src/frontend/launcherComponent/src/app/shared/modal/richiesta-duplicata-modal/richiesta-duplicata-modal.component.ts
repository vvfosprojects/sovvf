import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { ClearIndirizzo, ClearMarkerChiamata } from '../../../features/home/store/actions/scheda-telefonata/chiamata.actions';
import { ToggleChiamata } from '../../../features/home/store/actions/view/view.actions';

@Component({
    selector: 'app-richiesta-duplicata-modal',
    templateUrl: './richiesta-duplicata-modal.component.html',
    styleUrls: ['./richiesta-duplicata-modal.component.css']
})
export class RichiestaDuplicataModalComponent {

    messaggio: string;

    constructor(private store: Store,
                public modal: NgbActiveModal) {
    }

    onAction(actionName: string): void {
        switch (actionName) {
            case 'annullaChiamata':
                this.store.dispatch(new ClearMarkerChiamata());
                this.store.dispatch(new ToggleChiamata());
                this.modal.close('annullaChiamata');
                break;
            case 'cambiaIndirizzo':
                this.store.dispatch(new ClearMarkerChiamata());
                this.store.dispatch(new ClearIndirizzo());
                this.modal.close('cambiaIndirizzo');
                break;
            case 'continuaChiamata':
                this.modal.close('continuaChiamata');
                break;
        }
    }

}
