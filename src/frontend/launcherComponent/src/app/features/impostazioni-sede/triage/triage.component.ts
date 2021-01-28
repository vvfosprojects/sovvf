import { Component, ViewEncapsulation } from '@angular/core';
import { TreeItem, TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { TipologieState } from '../../../shared/store/states/tipologie/tipologie.state';
import { Observable } from 'rxjs';
import { Tipologia } from '../../../shared/model/tipologia.model';
import {
    ClearDettagliTipologie,
    ClearTriage,
    GetDettagliTipologieByCodTipologia,
    GetTriageByCodDettaglioTipologia,
    SaveTriage,
    SetDettaglioTipologiaTriage,
    SetNewTriage,
    SetNewTriageData
} from '../../../shared/store/actions/triage/triage.actions';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TriageState } from '../../../shared/store/states/triage/triage.state';
import { DettaglioTipologia } from '../../../shared/interface/dettaglio-tipologia.interface';
import { ItemTriageModalComponent } from '../../../shared/modal/item-triage-modal/item-triage-modal.component';
import { addQuestionMark, capitalize, makeCopy } from '../../../shared/helper/function';

@Component({
    selector: 'app-triage',
    templateUrl: './triage.component.html',
    styleUrls: ['./triage.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TriageComponent {

    @Select(TipologieState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(TriageState.dettagliTipologie) dettagliTipologie$: Observable<DettaglioTipologia[]>;
    @Select(TriageState.dettaglioTipologia) dettaglioTipologia$: Observable<DettaglioTipologia>;
    dettaglioTipologia: DettaglioTipologia;

    codTipologia: string;
    codDettaglioTipologia: any;

    tConfig = {
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 500
    } as TreeviewConfig;

    showTriage: boolean;

    tItems: TreeviewItem[];
    tItemsData = [];

    constructor(private store: Store,
                private modalService: NgbModal,
                private selectConfig: NgSelectConfig) {
        selectConfig.appendTo = 'body';
        selectConfig.notFoundText = 'Nessun elemento trovato';
        this.getDettaglioTipologia();
    }

    getDettaglioTipologia(): void {
        this.dettaglioTipologia$.subscribe((dettaglioTipologia: DettaglioTipologia) => {
            this.dettaglioTipologia = dettaglioTipologia;
        });
    }

    onSetCodTipologia(codTipologia: string): void {
        this.codDettaglioTipologia = null;
        this.codTipologia = codTipologia;
        this.store.dispatch(new GetDettagliTipologieByCodTipologia(+this.codTipologia));
    }

    onSetDettaglioTipologia(codDettaglioTipologia: number): void {
        this.codDettaglioTipologia = codDettaglioTipologia;
        this.store.dispatch([
            new SetDettaglioTipologiaTriage(this.codDettaglioTipologia),
            new GetTriageByCodDettaglioTipologia(this.codDettaglioTipologia)
        ]);
    }

    onReset(): void {
        this.store.dispatch([
            new ClearDettagliTipologie(),
            new ClearTriage()
        ]);
        this.codTipologia = null;
        this.codDettaglioTipologia = null;
        this.tItems = null;
        this.tItemsData = [];
        this.showTriage = false;
    }

    onShowTriage(): void {
        if (this.codDettaglioTipologia) {
            this.showTriage = true;
        }
    }

    initTriage(): void {
        this.addItem();
    }

    getItemData(item: any): any {
        const itemData = this.tItemsData.filter((data: any) => data.itemValue === item.value)[0];
        if (itemData) {
            if (item?.children?.length > 0) {
                itemData.domandaSeguente = item.children[0].text;
            }
            return itemData;
        }
    }

    addItem(item?: TreeItem): void {
        const addItemTriageModal = this.modalService.open(ItemTriageModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });

        if (this.tItems) {
            // TODO: correggere, viene visualizzato il titolo soltanto se la risposta selezionata è sì
            const itemValueToFind = item.value.slice(0, -2);
            addItemTriageModal.componentInstance.domandaTitle = this.findItem(this.tItems[0], itemValueToFind)?.text;
            addItemTriageModal.componentInstance.rispostaTitle = item.text;
        }
        addItemTriageModal.componentInstance.primaDomanda = !this.tItems;
        addItemTriageModal.componentInstance.tItem = item;
        addItemTriageModal.result.then((res: { success: boolean, data: any }) => {
            if (res.success) {
                if (this.tItems) {
                    if (res.data.domandaSeguente) {
                        this.addDomandaSeguente(item, res.data.domandaSeguente);
                    }
                    this.addOtherData(res, item);
                } else {
                    this.addPrimaDomanda(res.data.domandaSeguente);
                }
            }
        });
    }

    addPrimaDomanda(domanda: string): void {
        this.tItems = [
            new TreeviewItem({
                text: addQuestionMark(capitalize(domanda)),
                value: '1',
                children: [
                    {
                        text: 'Si',
                        value: '1-1',
                        disabled: true
                    },
                    {
                        text: 'No',
                        value: '2-1',
                        disabled: true
                    },
                    {
                        text: 'Non lo so',
                        value: '3-1',
                        disabled: true
                    }
                ]
            })
        ];
        this.updateTriage(this.tItems[0]);
    }

    addDomandaSeguente(item: TreeItem, domandaSeguente: string): void {
        item.children = [
            new TreeviewItem({
                text: addQuestionMark(capitalize(domandaSeguente)),
                value: item.value + '-1',
                children: [
                    { text: 'Si', value: '1-' + item.value + '-1', disabled: true },
                    { text: 'No', value: '2-' + item.value + '-1', disabled: true },
                    { text: 'Non lo so', value: '3-' + item.value + '-1', disabled: true }
                ]
            })
        ];
        this.updateTriage(this.tItems[0]);
    }

    addOtherData(res: any, item: TreeItem): void {
        const otherData = {
            itemValue: item.value,
            soccorsoAereo: null,
            generiMezzo: null,
            prioritaConsigliata: null
        };
        if (res.data.soccorsoAereo) {
            otherData.soccorsoAereo = res.data.soccorsoAereo;
        }
        if (res.data.generiMezzo) {
            otherData.generiMezzo = res.data.generiMezzo;
        }
        if (res.data.prioritaConsigliata) {
            otherData.prioritaConsigliata = res.data.prioritaConsigliata;
        }
        if (otherDataValues(otherData)) {
            this.tItemsData.push(otherData);
            this.updateTriageData(this.tItemsData);
        }

        function otherDataValues(data: any): boolean {
            return data?.soccorsoAereo || data?.generiMezzo || data?.prioritaConsigliata;
        }
    }

    editItem(item: TreeItem): void {
        const addItemTriageModal = this.modalService.open(ItemTriageModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addItemTriageModal.componentInstance.primaDomanda = false;
        addItemTriageModal.componentInstance.disableDomanda = item.children && item.children.length;
        addItemTriageModal.componentInstance.itemEdit = this.getItemData(item);
        addItemTriageModal.componentInstance.tItem = item;
        addItemTriageModal.result.then((res: { success: boolean, data: any }) => {
            if (res.success) {
                if (!item.children && res.data.domandaSeguente) {
                    this.addDomandaSeguente(item, res.data.domandaSeguente);
                }

                let iItemDataFound = 0;
                let index = 0;
                let itemDataFound: any;
                for (const tItemData of this.tItemsData) {
                    index = index + 1;
                    if (tItemData.itemValue === res.data.value) {
                        iItemDataFound = index;
                        itemDataFound = tItemData;
                    }
                }

                let editedItem: any;
                if (itemDataFound) {
                    editedItem = {
                        itemValue: item.value,
                        soccorsoAereo: itemDataFound.soccorsoAereo ? itemDataFound.soccorsoAereo : null,
                        generiMezzo: itemDataFound.generiMezzo ? itemDataFound.generiMezzo : null,
                        prioritaConsigliata: itemDataFound.prioritaConsigliata ? itemDataFound.prioritaConsigliata : null
                    };
                } else {
                    editedItem = {
                        itemValue: item.value,
                        soccorsoAereo: null,
                        generiMezzo: null,
                        prioritaConsigliata: null
                    };
                }

                if (res.data.soccorsoAereo) {
                    editedItem.soccorsoAereo = res.data.soccorsoAereo;
                } else {
                    editedItem.soccorsoAereo = null;
                }
                if (res.data.generiMezzo) {
                    editedItem.generiMezzo = res.data.generiMezzo;
                } else {
                    editedItem.generiMezzo = null;
                }
                if (res.data.prioritaConsigliata) {
                    editedItem.prioritaConsigliata = res.data.prioritaConsigliata;
                } else {
                    editedItem.prioritaConsigliata = null;
                }

                if (itemDataFound) {
                    this.tItemsData[iItemDataFound] = editedItem;
                } else {
                    this.tItemsData.push(editedItem);
                }
            }
        });
        this.updateTriage(this.tItems[0]);
    }

    removeItem(item: TreeviewItem): void {
        let index = 0;
        let iItemDataFound: number;
        for (const tItemData of this.tItemsData) {
            index = index + 1;
            if (tItemData.itemValue === item.value) {
                iItemDataFound = index;
            }
        }
        this.tItemsData.splice(iItemDataFound, 1);

        const parent = this.findItem(this.tItems[0], item.value.slice(0, -2));
        parent.children = null;
        this.updateTriage(this.tItems[0]);
    }

    findItem(element: any, value: string): TreeviewItem {
        if (element.value === value) {
            return element;
        } else if (element.children != null) {
            let i: number;
            let result = null;
            for (i = 0; result == null && i < element.children.length; i++) {
                result = this.findItem(element.children[i], value);
            }
            return result;
        }
        return null;
    }

    updateTriage(triage: any): void {
        this.store.dispatch(new SetNewTriage(makeCopy(triage)));
        this.updateTriageData(this.tItemsData);
    }

    updateTriageData(data: any): void {
        this.store.dispatch(new SetNewTriageData(makeCopy(data)));
    }

    saveTriage(): void {
        this.store.dispatch(new SaveTriage());
    }
}
