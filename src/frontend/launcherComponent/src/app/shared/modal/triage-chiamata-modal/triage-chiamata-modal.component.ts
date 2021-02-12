import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { ClearDettaglioTipologiaTriageChiamata, ClearTriageChiamata, SetDettaglioTipologiaTriageChiamata, SetTipologiaTriageChiamata } from '../../store/actions/triage-modal/triage-modal.actions';
import { TreeviewItem } from 'ngx-treeview';
import { makeCopy } from '../../helper/function';
import { ItemTriageData } from '../../interface/item-triage-data.interface';
import { RispostaTriage } from '../../interface/risposta-triage.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ViewportState } from '../../store/states/viewport/viewport.state';

@Component({
    selector: 'app-triage-chiamata-modal',
    templateUrl: './triage-chiamata-modal.component.html',
    styleUrls: ['./triage-chiamata-modal.component.scss']
})
export class TriageChiamataModalComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;

    @Select(TriageChiamataModalState.dettagliTipologia) dettagliTipologia$: Observable<DettaglioTipologia[]>;
    dettagliTipologia: DettaglioTipologia[];

    @Select(TriageChiamataModalState.triage) triage$: Observable<TreeviewItem>;
    triage: TreeviewItem;
    @Select(TriageChiamataModalState.triageData) triageData$: Observable<ItemTriageData[]>;
    triageData: ItemTriageData[];

    abilitaTriage: boolean;

    tipologiaSelezionata: Tipologia;
    dettaglioTipologiaSelezionato: DettaglioTipologia;

    nuovaRichiesta: SintesiRichiesta;
    chiamataMarker: ChiamataMarker;

    triageSummary: TriageSummary[];

    checkedEmergenza: boolean;
    disableEmergenza: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private store: Store,
                private modalService: NgbModal) {
        this.getDoubleMonitor();
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

    getDoubleMonitor(): void {
        this.subscriptions.add(this.doubleMonitor$.subscribe(r => this.doubleMonitor = r));
    }

    getDettagliTipologia(): void {
        this.subscriptions.add(
            this.dettagliTipologia$.subscribe((dettagliTipologia: DettaglioTipologia[]) => {
                if (dettagliTipologia) {
                    this.dettagliTipologia = dettagliTipologia;
                    if (!dettagliTipologia.length) {
                        this.setAbilitaTriage(true);
                    }
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
        }
        this.store.dispatch(new SetDettaglioTipologiaTriageChiamata(this.dettaglioTipologiaSelezionato?.codiceDettaglioTipologia));
        this.setAbilitaTriage(true);
    }

    onResetDettaglioTipologiaSelezionato(): void {
        this.setAbilitaTriage(false);
        this.dettaglioTipologiaSelezionato = null;
        this.store.dispatch([
            new ClearDettaglioTipologiaTriageChiamata(),
            new ClearTriageChiamata()
        ]);
        this.clearTriageSummary();
    }

    setAbilitaTriage(value: boolean): void {
        this.abilitaTriage = value;
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
            domanda: rispostaTriage.domanda,
            rispostaValue: rispostaTriage.rispostaValue,
            risposta: rispostaTriage.risposta
        } as TriageSummary;
        this.triageSummary.push(summaryItem);
    }

    getDomandaByCodice(rispostaValue: string): TreeviewItem {
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
        if (!this.dettaglioTipologiaSelezionato && !this.triageSummary?.length) {
            return this.dismissModal('dismiss');
        }
        const obj = { type, dettaglio: this.dettaglioTipologiaSelezionato, triageSummary: this.triageSummary };
        this.modal.close(obj);
    }

    dismissModal(type: string): void {
        let dismissTriageModal;
        if (this.doubleMonitor) {
            dismissTriageModal = this.modalService.open(ConfirmModalComponent, {
                windowClass: 'modal-holder modal-left',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'md'
            });
        } else {
            dismissTriageModal = this.modalService.open(ConfirmModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'md'
            });
        }
        dismissTriageModal.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        dismissTriageModal.componentInstance.titolo = 'Chiusura Triage';
        dismissTriageModal.componentInstance.messaggioAttenzione = 'Attenzione! Il dettaglio tipologia e le eventuali risposte non verrano salvate.';
        dismissTriageModal.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
            { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
        ];
        dismissTriageModal.result.then(
            (val: string) => {
                switch (val) {
                    case 'ok':
                        const obj = { type };
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
}
