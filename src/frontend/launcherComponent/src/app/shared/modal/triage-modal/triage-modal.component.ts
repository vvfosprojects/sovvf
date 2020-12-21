import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tipologia } from '../../model/tipologia.model';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { ChiamataMarker } from '../../../features/home/maps/maps-model/chiamata-marker.model';
import { SchedaTelefonataInterface } from '../../interface/scheda-telefonata.interface';
import { ReducerSchedaTelefonata } from '../../../features/home/store/actions/chiamata/scheda-telefonata.actions';
import { AzioneChiamataEnum } from '../../enum/azione-chiamata.enum';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-triage-modal',
    templateUrl: './triage-modal.component.html',
    styleUrls: ['./triage-modal.component.scss']
})
export class TriageModalComponent implements OnInit {

    tipologiaSelezionata: Tipologia;

    dettagliTipologie: any[];
    dettaglioTipologiaSelezionato: any;

    nuovaRichiesta: SintesiRichiesta;
    chiamataMarker: ChiamataMarker;

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

    checkedEmergenza: boolean;

    constructor(private modal: NgbActiveModal,
                private store: Store) {
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

    setEmergenza(): void {
        // TODO: rimuovere (fake check emergenza)
        this.checkedEmergenza = true;

        const schedaTelefonata: SchedaTelefonataInterface = {
            tipo: 'inserita',
            nuovaRichiesta: this.nuovaRichiesta,
            markerChiamata: this.chiamataMarker,
            emergenza: true
        };
        schedaTelefonata.azioneChiamata = AzioneChiamataEnum.MettiInCoda;
        schedaTelefonata.nuovaRichiesta.azione = AzioneChiamataEnum.MettiInCoda;
        this.store.dispatch(new ReducerSchedaTelefonata(schedaTelefonata));
    }

    closeModal(type: string): void {
        const obj = { type, result: this.dettaglioTipologiaSelezionato };
        this.modal.close(obj);
    }
}
