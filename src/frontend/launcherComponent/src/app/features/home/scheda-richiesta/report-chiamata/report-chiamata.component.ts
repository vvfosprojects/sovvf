import { Component, Input, OnInit } from '@angular/core';
import { SchedaContatto } from '../../../../shared/interface/scheda-contatto.interface';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { Tipologia } from '../../../../shared/model/tipologia.model';
import { DettaglioTipologia } from '../../../../shared/interface/dettaglio-tipologia.interface';
import { TriageSummary } from '../../../../shared/interface/triage-summary.interface';

@Component({
    selector: 'app-report-chiamata',
    templateUrl: './report-chiamata.component.html',
    styleUrls: ['./report-chiamata.component.scss']
})
export class ReportChiamataComponent implements OnInit {

    @Input() tipologie: Tipologia[];
    @Input() dettaglioTipologia: DettaglioTipologia;
    @Input() triageSummary: TriageSummary[];
    @Input() schedaContatto: SchedaContatto;
    @Input() countInterventiProssimita: number;
    @Input() interventiProssimita: SintesiRichiesta[];

    constructor() {
    }

    ngOnInit(): void {
    }
}
