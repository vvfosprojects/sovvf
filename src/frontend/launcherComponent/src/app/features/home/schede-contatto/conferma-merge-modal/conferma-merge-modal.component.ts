import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SchedaContatto } from '../../../../shared/interface/scheda-contatto.interface';
import { OpenDettaglioSchedaContatto } from '../../store/actions/schede-contatto/schede-contatto.actions';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-conferma-merge-modal',
    templateUrl: './conferma-merge-modal.component.html',
    styleUrls: ['./conferma-merge-modal.component.css']
})
export class ConfermaMergeModalComponent {

    schedeContatto: SchedaContatto[];

    constructor(public modal: NgbActiveModal,
                private store: Store) {
    }

    onDettaglioScheda(idSchedaContatto: string): void {
        this.store.dispatch(new OpenDettaglioSchedaContatto(idSchedaContatto));
    }

    close(esito: string): void {
        this.modal.close(esito);
    }

}
