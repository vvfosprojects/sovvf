import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tipologia } from '../../model/tipologia.model';
import { ChiamataMarker } from '../../../features/home/maps/maps-model/chiamata-marker.model';
import { SchedaTelefonataInterface } from '../../interface/scheda-telefonata.interface';
import { ReducerSchedaTelefonata } from '../../../features/home/store/actions/form-richiesta/scheda-telefonata.actions';
import { AzioneChiamataEnum } from '../../enum/azione-chiamata.enum';
import { Select, Store } from '@ngxs/store';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { TriageChiamataModalState } from '../../store/states/triage-chiamata-modal/triage-chiamata-modal.state';
import { Observable, Subscription } from 'rxjs';
import {
    ClearDettaglioTipologiaTriageChiamata,
    ClearTriageChiamata,
    SetDettaglioTipologiaTriageChiamata,
    SetTipologiaTriageChiamata
} from '../../store/actions/triage-modal/triage-modal.actions';
import { TreeviewItem } from 'ngx-treeview';
import { makeCopy } from '../../helper/function-generiche';
import { ItemTriageData } from '../../interface/item-triage-data.interface';
import { RispostaTriage } from '../../interface/risposta-triage.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { CheckboxInterface } from '../../interface/checkbox.interface';
import { PosInterface } from "../../interface/pos.interface";

@Component({
    selector: 'app-triage-chiamata-modal',
    templateUrl: './triage-chiamata-modal.component.html',
    styleUrls: ['./triage-chiamata-modal.component.scss']
})
export class TriageChiamataModalComponent implements OnInit, OnDestroy {

    @Select(TriageChiamataModalState.dettagliTipologia) dettagliTipologia$: Observable<DettaglioTipologia[]>;
    dettagliTipologia: DettaglioTipologia[];

    @Select(TriageChiamataModalState.triage) triage$: Observable<TreeviewItem>;
    triage: TreeviewItem;
    @Select(TriageChiamataModalState.triageData) triageData$: Observable<ItemTriageData[]>;
    triageData: ItemTriageData[];

    tipologiaSelezionata: Tipologia;
    dettaglioTipologiaSelezionato: DettaglioTipologia;
    pos: PosInterface[];

    chiamataMarker: ChiamataMarker;

    triageSummary: TriageSummary[];

    checkedUrgenza: boolean;
    disableUrgenza: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private store: Store,
                private modalService: NgbModal) {
        this.getTriage();
        this.getTriageData();
    }

    ngOnInit(): void {
        this.store.dispatch(new SetTipologiaTriageChiamata(+this.tipologiaSelezionata.codice));
        if (this.dettaglioTipologiaSelezionato) {
            this.setDettaglioTipologiaSelezionato();
        }
        this.getDettagliTipologia();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getDettagliTipologia(): void {
        this.subscriptions.add(
            this.dettagliTipologia$.subscribe((dettagliTipologia: DettaglioTipologia[]) => {
                if (dettagliTipologia) {
                    this.dettagliTipologia = dettagliTipologia;
                }
            })
        );
    }

    getTriage(): void {
        this.subscriptions.add(
            this.triage$.subscribe((triage: TreeviewItem) => {
                if (triage) {
                    let index = 0;
                    const mappedTriage = [];
                    const triageArray = [makeCopy(triage)];
                    for (const item of triageArray) {
                        index = index + 1;
                        mappedTriage[0] = getFatherMapped(item);
                    }
                    this.triage = mappedTriage[0];
                } else {
                    this.triage = null;
                }
            })
        );

        function getFatherMapped(item): TreeviewItem {
            return new TreeviewItem({
                text: item.text,
                value: item.value,
                children: item.internalChildren?.length ? mapTreeviewItems(item.internalChildren) : null,
                collapsed: item.internalCollapsed,
                disabled: item.internalDisabled
            });
        }

        function mapTreeviewItems(childrens: any): any {
            const childrensCopy = childrens;
            let childrenIndex = 0;
            for (const children of childrensCopy) {
                childrensCopy[childrenIndex] = getChildrenMapped(children);
                childrenIndex = childrenIndex + 1;
                if (children?.internalChildren) {
                    mapTreeviewItems(children.internalChildren);
                }
            }
            childrens = childrensCopy;
            return childrens;
        }

        function getChildrenMapped(item): TreeviewItem {
            return new TreeviewItem({
                text: item.text,
                value: item.value,
                children: item.internalChildren?.length ? mapTreeviewItems(item.internalChildren) : null,
                collapsed: item.internalCollapsed,
                disabled: item.internalDisabled
            });
        }
    }

    getTriageData(): void {
        this.subscriptions.add(
            this.triageData$.subscribe((triageData: ItemTriageData[]) => {
                if (triageData) {
                    this.triageData = triageData;
                } else {
                    this.triageData = null;
                }
            })
        );
    }

    setDettaglioTipologiaSelezionato(codDettaglioTipologia?: number): void {
        if (codDettaglioTipologia) {
            this.dettaglioTipologiaSelezionato = this.dettagliTipologia?.filter((d: DettaglioTipologia) => d.codiceDettaglioTipologia === codDettaglioTipologia)[0];
            this.pos = [this.dettaglioTipologiaSelezionato?.pos];
        }
        this.store.dispatch(new SetDettaglioTipologiaTriageChiamata(this.dettaglioTipologiaSelezionato?.codiceDettaglioTipologia, this.pos));
    }

    onResetDettaglioTipologiaSelezionato(): void {
        this.dettaglioTipologiaSelezionato = null;
        this.store.dispatch([
            new ClearDettaglioTipologiaTriageChiamata(),
            new ClearTriageChiamata()
        ]);
        this.clearTriageSummary();
    }

    clearTriageSummary(): void {
        this.triageSummary = null;
    }

    getDomandeTriage(): void {
        this.subscriptions.add(
            this.triage$.subscribe((triage: TreeviewItem) => {
                this.triage = triage;
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
        const parentValue = rispostaValue.slice(2);
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
        const schedaTelefonata: SchedaTelefonataInterface = {
            tipo: 'inserita',
            markerChiamata: this.chiamataMarker
        };
        schedaTelefonata.azioneChiamata = AzioneChiamataEnum.MettiInCoda;
        this.store.dispatch(new ReducerSchedaTelefonata(schedaTelefonata, { urgente: true }));
        this.checkedUrgenza = true;
        this.disableUrgenza = true;
    }

    closeModal(type: string): void {
        if (this.dettaglioTipologiaSelezionato && !this.triageSummary?.length) {
            return this.dismissModal('dismiss');
        }
        const obj = { type, dettaglio: this.dettaglioTipologiaSelezionato, triageSummary: this.triageSummary, pos: this.pos };
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
                        const obj = { type, dettaglio: this.dettaglioTipologiaSelezionato, pos: this.pos };
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
        return !this.dettaglioTipologiaSelezionato ? 'Dettaglio Tipologia' : 'Triage';
    }
}
