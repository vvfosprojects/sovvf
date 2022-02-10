import { Component, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tipologia } from '../../model/tipologia.model';
import { ChiamataMarker } from '../../../features/maps/maps-model/chiamata-marker.model';
import { SchedaTelefonataInterface } from '../../interface/scheda-telefonata.interface';
import { ReducerSchedaTelefonata } from '../../../features/home/store/actions/form-richiesta/scheda-telefonata.actions';
import { AzioneChiamataEnum } from '../../enum/azione-chiamata.enum';
import { Select, Store } from '@ngxs/store';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { TriageChiamataModalState } from '../../store/states/triage-chiamata-modal/triage-chiamata-modal.state';
import { Observable, Subscription } from 'rxjs';
import { TreeviewItem } from 'ngx-treeview';
import { ItemTriageData } from '../../interface/item-triage-data.interface';
import { RispostaTriage } from '../../interface/risposta-triage.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { CheckboxInterface } from '../../interface/checkbox.interface';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import { SchedaTelefonataState } from '../../../features/home/store/states/form-richiesta/scheda-telefonata.state';

@Component({
    selector: 'app-triage-chiamata-modal',
    templateUrl: './triage-chiamata-modal.component.html',
    styleUrls: ['./triage-chiamata-modal.component.scss']
})
export class TriageChiamataModalComponent implements OnDestroy {

    @Select(TriageChiamataModalState.dettagliTipologia) dettagliTipologia$: Observable<DettaglioTipologia[]>;
    dettagliTipologia: DettaglioTipologia[];
    @Select(ViewComponentState.chiamataStatus) chiamataStatus$: Observable<boolean>;
    chiamataStatus: boolean;
    @Select(ViewComponentState.chiamataFromMappaStatus) chiamataFromMappaStatus$: Observable<boolean>;
    chiamataFromMappaStatus: boolean;
    @Select(ViewComponentState.modificaRichiestaStatus) modificaRichiestaStatus$: Observable<boolean>;
    modificaRichiestaStatus: boolean;
    @Select(SchedaTelefonataState.loadingSchedaRichiesta) loadingSchedaRichiesta$: Observable<boolean>;
    loadingSchedaRichiesta: boolean;

    triage: TreeviewItem;
    triageData: ItemTriageData[];

    tipologiaSelezionata: Tipologia;
    dettaglioTipologiaSelezionato: DettaglioTipologia;

    chiamataMarker: ChiamataMarker;

    triageSummary: TriageSummary[];

    checkedUrgenza: boolean;
    disableUrgenza: boolean;
    apertoFromMappa: boolean;
    domandeTerminate: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private store: Store,
                private modalService: NgbModal) {
        this.getChiamataStatus();
        this.getChiamataFromMappaStatus();
        this.getModificaRichiestaStatus();
        this.getLoadingSchedaRichiesta();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getChiamataStatus(): void {
        this.subscriptions.add(
            this.chiamataStatus$.subscribe((status: boolean) => {
                this.chiamataStatus = status;
            })
        );
    }

    getChiamataFromMappaStatus(): void {
        this.subscriptions.add(
            this.chiamataFromMappaStatus$.subscribe((status: boolean) => {
                this.chiamataFromMappaStatus = status;
            })
        );
    }

    getModificaRichiestaStatus(): void {
        this.subscriptions.add(
            this.modificaRichiestaStatus$.subscribe((status: boolean) => {
                this.modificaRichiestaStatus = status;
            })
        );
    }

    getLoadingSchedaRichiesta(): void {
        this.subscriptions.add(
            this.loadingSchedaRichiesta$.subscribe((status: boolean) => {
                this.loadingSchedaRichiesta = status;
            })
        );
    }

    setRisposta(rispostaTriage: RispostaTriage): void {
        if (!this.triageSummary) {
            this.triageSummary = [];
        }
        const itemData = this.triageData.filter((t: ItemTriageData) => t.itemValue === rispostaTriage.rispostaValue)[0] as ItemTriageData;
        const summaryItem = {
            itemValue: itemData?.itemValue,
            soccorsoAereo: itemData?.soccorsoAereo,
            generiMezzo: itemData?.generiMezzo?.length ? itemData?.generiMezzo : null,
            prioritaConsigliata: itemData?.prioritaConsigliata,
            noteOperatore: itemData?.noteOperatore,
            noteUtente: itemData?.noteUtente,
            domanda: rispostaTriage.domanda,
            rispostaValue: rispostaTriage.rispostaValue,
            risposta: rispostaTriage.risposta
        } as TriageSummary;
        this.triageSummary.push(summaryItem);
    }

    getDomandaByRispostaValue(rispostaValue: string): TreeviewItem {
        const parentValue = rispostaValue.length === 5 ? rispostaValue.slice(4) : rispostaValue.slice(2);
        return findItem(this.triage, parentValue);

        function findItem(element: any, value: string): TreeviewItem {
            if (element.value === value) {
                return element;
            } else if (element.children != null) {
                let i: number;
                let result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = findItem(element.children[i], value);
                }
                return result;
            }
            return null;
        }
    }

    getSuggerimentoByRispostaValue(rispostaValue: string): string {
        const triageData = this.triageData.filter((data: ItemTriageData) => data.itemValue === rispostaValue)[0];
        if (triageData) {
            return triageData?.noteUtente;
        }
        return null;
    }

    getCheckboxUrgenzaState(): CheckboxInterface {
        const id = 'check-chiamata-emergenza';
        const status = this.checkedUrgenza;
        const label = this.checkedUrgenza ? 'URGENZA SEGNALATA' : 'SEGNALA URGENZA E CONDIVIDI IN GESTIONE';
        const disabled = this.disableUrgenza;
        return { id, status, label, disabled };
    }

    setUrgenza(): void {
        if (!this.disableUrgenza) {
            const schedaTelefonata: SchedaTelefonataInterface = {
                tipo: 'inserita',
                markerChiamata: this.chiamataMarker
            };
            schedaTelefonata.azioneChiamata = AzioneChiamataEnum.MettiInCoda;
            this.store.dispatch(new ReducerSchedaTelefonata(schedaTelefonata, { urgente: true }));
            this.checkedUrgenza = true;
            this.disableUrgenza = true;
        }
    }

    checkFineTriage(fineTriage: boolean): void {
        this.domandeTerminate = fineTriage;
    }

    closeModal(type: string): void {
        if (this.dettaglioTipologiaSelezionato && !this.triageSummary?.length) {
            return this.dismissModal('dismiss');
        }
        const obj = {
            type,
            dettaglio: this.dettaglioTipologiaSelezionato,
            triageSummary: this.triageSummary
        };
        this.modal.close(obj);
    }

    dismissModal(type: string): void {
        let dismissTriageModal: any;
        dismissTriageModal = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'md'
        });
        dismissTriageModal.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        dismissTriageModal.componentInstance.titolo = 'Chiusura Triage';
        dismissTriageModal.componentInstance.messaggioAttenzione = 'Attenzione! Le eventuali risposte del triage non verrano salvate.';

        dismissTriageModal.result.then(
            (val: string) => {
                switch (val) {
                    case 'ok':
                        const obj = { type, dettaglio: this.dettaglioTipologiaSelezionato };
                        this.modal.close(obj);
                        break;
                    case 'ko':
                        break;
                    default:
                        break;
                }
            },
            (err) => {
                console.error('removeTriageItemModal chiusa senza bottoni. (err => ' + err + ')');
            }
        );
    }

    getTitle(): string {
        return 'Triage';
    }
}
