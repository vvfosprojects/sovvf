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
import { SetDettaglioTipologiaTriageChiamata, SetTipologiaTriageChiamata } from '../../store/actions/triage-modal/triage-modal.actions';
import { TreeviewItem } from 'ngx-treeview';

@Component({
    selector: 'app-triage-chiamata-modal',
    templateUrl: './triage-chiamata-modal.component.html',
    styleUrls: ['./triage-chiamata-modal.component.scss']
})
export class TriageChiamataModalComponent implements OnInit {

    @Select(TriageChiamataModalState.dettagliTipologia) dettagliTipologia$: Observable<DettaglioTipologia[]>;
    dettagliTipologia: DettaglioTipologia[];

    @Select(TriageChiamataModalState.triage) triage$: Observable<TreeviewItem>;
    domandeTriage: TreeviewItem;

    // TODO: eliminare
    /* domandeTriage = {
        value: '1',
        text: 'C\'è qualcuno in casa?',
        children: [
            {
                value: '1-2',
                text: 'Si'
            },
            {
                value: '2-1',
                text: 'No'
            },
            {
                value: '3-1',
                text: 'Non lo so'
            },
        ]
    } as TreeviewItem; */

    tipologiaSelezionata: Tipologia;

    dettaglioTipologiaSelezionato: DettaglioTipologia;

    nuovaRichiesta: SintesiRichiesta;
    chiamataMarker: ChiamataMarker;

    risposteTriage: any[];
    codDomandaSelezionata: string;

    checkedEmergenza: boolean;
    disableEmergenza: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(new SetTipologiaTriageChiamata(+this.tipologiaSelezionata.codice));
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
        this.store.dispatch(new SetDettaglioTipologiaTriageChiamata(this.dettaglioTipologiaSelezionato.codiceDettaglioTipologia));
        this.onAbilitaTriage();
    }

    onAbilitaTriage(): void {
        this.codDomandaSelezionata = this.domandeTriage[0].value;
    }

    getDomandeTriage(): void {
        this.subscriptions.add(
            this.triage$.subscribe((triage: TreeviewItem) => {
                this.domandeTriage = triage;
            })
        );
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
        this.codDomandaSelezionata = domandaSelezionata ? domandaSelezionata.value : null;
    }

    getDomandaByCodice(codDomanda: string): string {
        return this.domandeTriage.children.filter((d: any) => d.codice === codDomanda)[0].text;
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
