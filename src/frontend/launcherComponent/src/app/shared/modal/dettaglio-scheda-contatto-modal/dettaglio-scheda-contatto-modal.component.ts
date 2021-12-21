import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { Priorita } from '../../model/sintesi-richiesta.model';
import { SetRichiestaById } from '../../../features/home/store/actions/richieste/richieste.actions';
import { SintesiRichiestaModalComponent } from '../sintesi-richiesta-modal/sintesi-richiesta-modal.component';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-dettaglio-scheda-contatto-modal',
    templateUrl: './dettaglio-scheda-contatto-modal.component.html',
    styleUrls: ['./dettaglio-scheda-contatto-modal.component.css']
})
export class DettaglioSchedaContattoModalComponent {

    schedaContatto: SchedaContatto;
    priorita = Priorita;

    constructor(private modal: NgbActiveModal,
                private modalService: NgbModal,
                private store: Store) {
    }

    defineChiamataIntervento(codice: string): string {
        if (codice) {
            return codice.split('-')[1]?.length > 4 ? 'Chiamata' : 'Intervento';
        }
    }

    /* Apre il modal per visualizzare la richiesta */
    onDettaglioRichiesta(idRichiesta: string): void {
        this.store.dispatch(new SetRichiestaById(idRichiesta));
        this.modalService.open(SintesiRichiestaModalComponent, {
            windowClass: 'xxlModal modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
    }

    close(type: string): void {
        this.modal.close(type);
    }

}
