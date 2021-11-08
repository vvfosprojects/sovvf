import { Component } from '@angular/core';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';

@Component({
    selector: 'app-triage-summary-modal',
    templateUrl: './triage-summary-modal.component.html',
    styleUrls: ['./triage-summary-modal.component.scss']
})
export class TriageSummaryModalComponent {

    codRichiesta: string;
    titolo: string;
    tipologia: Tipologia;
    dettaglioTipologia: DettaglioTipologia;
    schedaContatto: SchedaContatto;
    triageSummary: TriageSummary[];

    constructor(private modal: NgbActiveModal) {
    }

    closeModal(type: string): void {
        this.modal.close({ success: false, data: type });
    }
}
