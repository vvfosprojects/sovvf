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
            codice: '1',
            titolo: 'C\'è qualcuno in casa?',
            tipo: 'boolean',
            campo: 'priorita',
            effettiRisposteSuCampo: [
                {
                    risposta: 'si',
                    valoreSuCampo: '5'
                },
                {
                    risposta: 'no',
                    valoreSuCampo: '3',
                    codProssimaDomanda: '3'
                },
                {
                    risposta: 'non lo so',
                    valoreSuCampo: '3'
                }
            ]
        },
        {
            codice: '2',
            titolo: 'Ci sono persone in pericolo?',
            tipo: 'boolean',
            campo: 'priorita',
            effettiRisposteSuCampo: [
                {
                    risposta: 'si',
                    valoreSuCampo: '5'
                },
                {
                    risposta: 'no',
                    valoreSuCampo: '3'
                },
                {
                    risposta: 'non lo so',
                    valoreSuCampo: '3'
                }
            ]
        },
        /* {
            codice: '3',
            titolo: 'Che piano è?',
            tipo: 'number',
            campo: 'piano'
        },*/
    ];
    risposteTriage: any[];
    codDomandaSelezionata: string;

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
        if (!this.dettagliTipologie || this.dettagliTipologie.length <= 0) {
            this.onAbilitaTriage();
        }
    }

    onChangeDettaglioTipologia(codDettaglioTipologia: string): void {
        this.dettaglioTipologiaSelezionato = this.dettagliTipologie.filter((dT: any) => dT.codice === codDettaglioTipologia)[0];
        this.onAbilitaTriage();
    }

    onAbilitaTriage(): void {
        this.abilitaTriage = true;
        this.codDomandaSelezionata = this.domandeTriage[0].codice;
    }

    setRisposta(codDomanda: string, risposta: any): void {
        if (!this.risposteTriage) {
            this.risposteTriage = [];
        }
        this.risposteTriage.push({ codDomanda, risposta });
        this.nextDomanda();
    }

    nextDomanda(): void {
        console.log(this.codDomandaSelezionata);
        const indexDomandaDaVisualizzare = (+this.codDomandaSelezionata + 1) - 1;
        console.log(indexDomandaDaVisualizzare);
        const domandaSelezionata = this.domandeTriage[indexDomandaDaVisualizzare];
        this.codDomandaSelezionata = domandaSelezionata ? domandaSelezionata.codice : null;
        console.log(this.codDomandaSelezionata);
    }

    getDomandaByCodice(codDomanda: string): string {
        return this.domandeTriage.filter((d: any) => d.codice === codDomanda)[0].titolo;
    }

    closeModal(type: string): void {
        const obj = { type, result: this.dettaglioTipologiaSelezionato };
        this.modal.close(obj);
    }
}
