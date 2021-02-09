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
import { TreeItem, TreeviewItem } from 'ngx-treeview';
import { makeCopy } from '../../helper/function';

@Component({
    selector: 'app-triage-chiamata-modal',
    templateUrl: './triage-chiamata-modal.component.html',
    styleUrls: ['./triage-chiamata-modal.component.scss']
})
export class TriageChiamataModalComponent implements OnInit {

    @Select(TriageChiamataModalState.dettagliTipologia) dettagliTipologia$: Observable<DettaglioTipologia[]>;
    dettagliTipologia: DettaglioTipologia[];

    @Select(TriageChiamataModalState.triage) triage$: Observable<TreeviewItem>;
    triage: TreeviewItem;

    abilitaTriage: boolean;

    tipologiaSelezionata: Tipologia;

    dettaglioTipologiaSelezionato: DettaglioTipologia;

    nuovaRichiesta: SintesiRichiesta;
    chiamataMarker: ChiamataMarker;

    risposteTriage: any[];

    checkedEmergenza: boolean;
    disableEmergenza: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private store: Store) {
        this.getTriage();
    }

    ngOnInit(): void {
        this.store.dispatch(new SetTipologiaTriageChiamata(+this.tipologiaSelezionata.codice));
        this.getDettagliTipologia();
    }

    getDettagliTipologia(): void {
        this.subscriptions.add(
            this.dettagliTipologia$.subscribe((dettagliTipologia: DettaglioTipologia[]) => {
                if (dettagliTipologia) {
                    this.dettagliTipologia = dettagliTipologia;
                    if (!dettagliTipologia.length) {
                        this.onAbilitaTriage();
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

    onChangeDettaglioTipologia(codDettaglioTipologia: number): void {
        this.dettaglioTipologiaSelezionato = this.dettagliTipologia.filter((d: DettaglioTipologia) => d.codiceDettaglioTipologia === codDettaglioTipologia)[0];
        this.store.dispatch(new SetDettaglioTipologiaTriageChiamata(this.dettaglioTipologiaSelezionato.codiceDettaglioTipologia));
        this.onAbilitaTriage();
    }

    onAbilitaTriage(): void {
        this.abilitaTriage = true;
    }

    getDomandeTriage(): void {
        this.subscriptions.add(
            this.triage$.subscribe((triage: TreeviewItem) => {
                this.triage = triage;
            })
        );
    }

    setRisposta(rispostaValue: string, risposta: string): void {
        if (!this.risposteTriage) {
            this.risposteTriage = [];
        }
        this.risposteTriage.push({ rispostaValue, risposta });
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
        const obj = { type, result: this.dettaglioTipologiaSelezionato };
        this.modal.close(obj);
    }
}
