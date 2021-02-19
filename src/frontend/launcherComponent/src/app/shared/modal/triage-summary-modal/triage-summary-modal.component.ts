import { Component } from '@angular/core';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-triage-summary-modal',
    templateUrl: './triage-summary-modal.component.html',
    styleUrls: ['./triage-summary-modal.component.scss']
})
export class TriageSummaryModalComponent {

    codRichiesta: string;
    tipologie: Tipologia[];
    dettaglioTipologia: DettaglioTipologia;
    schedaContatto: SchedaContatto;

    constructor(private modal: NgbActiveModal) {
    }

    closeModal(type: string): void {
        this.modal.close({ success: false, data: type });
    }

    getTitle(): string {
        if (this.codRichiesta) {
            return 'Dettaglio Triage della richiesta ' + this.codRichiesta;
        }
    }
}
