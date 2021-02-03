import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tipologia } from '../../model/tipologia.model';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { ChiamataMarker } from '../../../features/home/maps/maps-model/chiamata-marker.model';
import { SchedaTelefonataInterface } from '../../interface/scheda-telefonata.interface';
import { ReducerSchedaTelefonata } from '../../../features/home/store/actions/scheda-telefonata/chiamata.actions';
import { AzioneChiamataEnum } from '../../enum/azione-chiamata.enum';
import { Select, Store } from '@ngxs/store';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { TriageChiamataModalState } from '../../store/states/triage-chiamata-modal/triage-chiamata-modal.state';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-triage-chiamata-modal',
    templateUrl: './triage-chiamata-modal.component.html',
    styleUrls: ['./triage-chiamata-modal.component.scss']
})
export class TriageChiamataModalComponent implements OnInit {

    tipologiaSelezionata: Tipologia;

    @Select(TriageChiamataModalState.dettagliTipologia) dettagliTipologia$: Observable<DettaglioTipologia[]>;
    dettagliTipologia: DettaglioTipologia[];

    dettaglioTipologiaSelezionato: DettaglioTipologia;

    nuovaRichiesta: SintesiRichiesta;
    chiamataMarker: ChiamataMarker;

    abilitaTriage: boolean;
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
        }
    ];
    risposteTriage: any[];
    codDomandaSelezionata: string;

    checkedEmergenza: boolean;
    disableEmergenza: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private store: Store) {
    }

    ngOnInit(): void {
        this.getDettagliTipologia();
    }

    getDettagliTipologia(): void {
        this.subscriptions.add(
            this.dettagliTipologia$.subscribe((dettagliTipologia: DettaglioTipologia[]) => {
                this.dettagliTipologia = dettagliTipologia;
                if (dettagliTipologia && dettagliTipologia.length <= 0) {
                    this.onAbilitaTriage();
                }
            })
        );
    }

    onChangeDettaglioTipologia(codDettaglioTipologia: number): void {
        this.dettaglioTipologiaSelezionato = this.dettagliTipologia.filter((d: DettaglioTipologia) => d.codiceDettaglioTipologia === codDettaglioTipologia)[0];
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
        const indexDomandaDaVisualizzare = (+this.codDomandaSelezionata + 1) - 1;
        const domandaSelezionata = this.domandeTriage[indexDomandaDaVisualizzare];
        this.codDomandaSelezionata = domandaSelezionata ? domandaSelezionata.codice : null;
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
            markerChiamata: this.chiamataMarker
        };
        schedaTelefonata.azioneChiamata = AzioneChiamataEnum.MettiInCoda;
        schedaTelefonata.nuovaRichiesta.azione = AzioneChiamataEnum.MettiInCoda;
        schedaTelefonata.nuovaRichiesta.emergenza = true;
        this.store.dispatch(new ReducerSchedaTelefonata(schedaTelefonata));
    }

    closeModal(type: string): void {
        const obj = { type, result: this.dettaglioTipologiaSelezionato };
        this.modal.close(obj);
    }
}
