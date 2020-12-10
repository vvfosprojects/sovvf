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

    dettagliTipologie: any[];
    dettaglioTipologiaSelezionato: any;

    abilitaTriage: boolean;
    // TODO: ELIMINARE (PER FAKE)
    domandeTriage = [
        {
            titolo: 'C\'è qualcuno in casa?',
            tipo: 'boolean',
            risposte: ['si', 'no'],
            campo: 'priorita',
            effettiRisposteSuCampo: [
                {
                    risposta: 'si',
                    valoreSuCampo: '5'
                },
                {
                    risposta: 'no',
                    valoreSuCampo: '3'
                }
            ]
        },
        {
            titolo: 'Che piano è?',
            tipo: 'number',
            campo: 'piano'
        }
    ];
    stepDomanda: number;

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
        if (!this.dettagliTipologie || this.dettagliTipologie.length <= 0) {
            this.onAbilitaTriage();
        }
    }

    onChangeDettaglioTipologia(codDettaglioTipologia: string): void {
        this.dettaglioTipologiaSelezionato = this.dettagliTipologie.filter((dT: any) => dT.codice === codDettaglioTipologia)[0];
    }

    onAbilitaTriage(): void {
        this.abilitaTriage = true;
        this.stepDomanda = 1;
    }

    nextDomanda(): void {
        this.stepDomanda = this.stepDomanda++;
    }

    closeModal(type: string): void {
        const obj = { type, result: this.dettaglioTipologiaSelezionato };
        this.modal.close(obj);
    }
}
