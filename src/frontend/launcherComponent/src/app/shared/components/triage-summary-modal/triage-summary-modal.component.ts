import { Component, Input, OnInit } from '@angular/core';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';

@Component({
    selector: 'app-triage-summary-modal',
    templateUrl: './triage-summary-modal.component.html',
    styleUrls: ['./triage-summary-modal.component.scss']
})
export class TriageSummaryModalComponent implements OnInit {

    tipologie: Tipologia[];
    dettaglioTipologia: DettaglioTipologia;
    schedaContatto: SchedaContatto;

    constructor() {
    }

    ngOnInit(): void {
    }

}
