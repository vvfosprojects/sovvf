import { Component } from '@angular/core';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-triage-summary-modal',
    templateUrl: './triage-summary-modal.component.html',
    styleUrls: ['./triage-summary-modal.component.scss']
})
export class TriageSummaryModalComponent {

    codRichiesta: string;
    tipologia: Tipologia;
    dettaglioTipologia: DettaglioTipologia;

    constructor(private modal: NgbActiveModal) {
    }

    closeModal(type: string): void {
        this.modal.close({ success: false, data: type });
    }
}
