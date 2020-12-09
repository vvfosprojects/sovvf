import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tipologia } from '../../model/tipologia.model';

@Component({
    selector: 'app-triage-modal',
    templateUrl: './triage-modal.component.html',
    styleUrls: ['./triage-modal.component.scss']
})
export class TriageModalComponent implements OnInit {

    tipologiaSelezionata: Tipologia;
    // TODO: da inserire nello store e prendere con un selector
    dettagliTipologia: any[] = [
        {
            codice: '1',
            codSede: 'RM.1000',
            codTipologia: '1',
            descrizione: 'Indendio Auto'
        },
        {
            codice: '2',
            codSede: 'RM.1000',
            codTipologia: '1',
            descrizione: 'Indendio Auto Cisterna'
        }
    ];
    dettaglioTipologiaSelezionato: any;

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    onChangeDettaglioTipologia(codDettaglioTipologia: string): void {
        this.dettaglioTipologiaSelezionato = this.dettagliTipologia.filter((dT: any) => dT.codice === codDettaglioTipologia)[0];
    }

    closeModal(type: string): void {
        const obj = { type, result: this.dettaglioTipologiaSelezionato };
        console.log('closeModal', obj);
        this.modal.close(obj);
    }
}
