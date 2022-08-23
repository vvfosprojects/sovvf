import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { Priorita } from '../../model/sintesi-richiesta.model';
import { SetRichiestaById } from '../../../features/home/store/actions/richieste/richieste.actions';
import { SintesiRichiestaModalComponent } from '../sintesi-richiesta-modal/sintesi-richiesta-modal.component';
import { Store } from '@ngxs/store';
import { RichiesteState } from '../../../features/home/store/states/richieste/richieste.state';

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
        const richiestaById = this.store.selectSnapshot(RichiesteState.getRichiestaById);
        if (!richiestaById) {
            this.store.dispatch(new SetRichiestaById(idRichiesta));
            this.modalService.open(SintesiRichiestaModalComponent, {
                windowClass: 'xxlModal modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true
            });
        } else {
            console.warn('Dettaglio Richiesta già aperto');
        }
    }

    close(type: string): void {
        this.modal.close(type);
    }

}
