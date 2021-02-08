import { Component, ViewEncapsulation } from '@angular/core';
import { TreeItem, TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { TipologieState } from '../../../shared/store/states/tipologie/tipologie.state';
import { Observable, Subscription } from 'rxjs';
import { Tipologia } from '../../../shared/model/tipologia.model';
import {
    ClearDettagliTipologie,
    ClearTriage,
    GetDettagliTipologieByCodTipologia,
    GetTriageByCodDettaglioTipologia,
    AddTriage,
    SetDettaglioTipologiaTriage,
    SetNewTriage,
    AddTriageData,
    DeleteTriageData,
    UpdateTriage, SetNewTriageData
} from '../../../shared/store/actions/triage-crud/triage-crud.actions';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TriageCrudState } from '../../../shared/store/states/triage-crud/triage-crud.state';
import { DettaglioTipologia } from '../../../shared/interface/dettaglio-tipologia.interface';
import { ItemTriageModalComponent } from '../../../shared/modal/item-triage-modal/item-triage-modal.component';
import { addQuestionMark, capitalize, makeCopy } from '../../../shared/helper/function';
import { ViewportState } from '../../../shared/store/states/viewport/viewport.state';
import { ItemTriageData } from '../../../shared/interface/item-triage-data.interface';

@Component({
    selector: 'app-triage',
    templateUrl: './triage.component.html',
    styleUrls: ['./triage.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TriageComponent {

    tConfig = {
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 500
    } as TreeviewConfig;

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;

    @Select(TipologieState.tipologie) tipologie$: Observable<Tipologia[]>;

    @Select(TriageCrudState.dettagliTipologie) dettagliTipologie$: Observable<DettaglioTipologia[]>;

    @Select(TriageCrudState.dettaglioTipologia) dettaglioTipologia$: Observable<DettaglioTipologia>;
    dettaglioTipologia: DettaglioTipologia;

    @Select(TriageCrudState.triageByDettaglioTipologia) triageByDettaglioTipologia$: Observable<TreeItem>;
    tItems: TreeviewItem[];
    @Select(TriageCrudState.triageDataByDettaglioTipologia) triageDataByDettaglioTipologia$: Observable<ItemTriageData[]>;
    tItemsData: ItemTriageData[];
    @Select(TriageCrudState.editMode) editMode$: Observable<boolean>;
    editMode: boolean;

    codTipologia: string;
    codDettaglioTipologia: any;

    showTriage: boolean;

    viewEditButtons = true;

    itemValueTitleEdit: string;
    itemTitleEdit: string;

    unsavedModifiche: boolean;

    private subscription = new Subscription();

    constructor(private store: Store,
                private modalService: NgbModal,
                private selectConfig: NgSelectConfig) {
        selectConfig.appendTo = 'body';
        selectConfig.notFoundText = 'Nessun elemento trovato';
        this.getDettaglioTipologia();
        this.getDoubleMonitor();
        this.getEditMode();
    }

    getDoubleMonitor(): void {
        this.subscription.add(this.doubleMonitor$.subscribe(r => this.doubleMonitor = r));
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
        this.store.dispatch(new SetDettaglioTipologiaTriage(this.codDettaglioTipologia));
    }

    onReset(): void {
        this.store.dispatch([
            new ClearDettagliTipologie(),
            new ClearTriage()
        ]);
        this.codTipologia = null;
        this.codDettaglioTipologia = null;
        this.tItems = null;
        this.tItemsData = null;
        this.showTriage = false;
    }

    onShowTriage(): void {
        if (this.codDettaglioTipologia && this.codTipologia) {
            this.store.dispatch(new GetTriageByCodDettaglioTipologia(+this.codTipologia, this.codDettaglioTipologia));
            this.getTriageByDettaglioTipologia();
            this.getTriageDataByDettaglioTipologia();
            this.showTriage = true;
        }
    }

    getTriageByDettaglioTipologia(): void {
        this.subscription.add(
            this.triageByDettaglioTipologia$.subscribe((triage: any) => {
                if (triage) {
                    let index = 0;
                    const mappedTriage = [];
                    const triageArray = [makeCopy(triage)];
                    for (const item of triageArray) {
                        index = index + 1;
                        mappedTriage[0] = getFatherMapped(item);
                    }
                    this.tItems = [];
                    this.tItems[0] = mappedTriage[0];
                }

                function getFatherMapped(item): TreeviewItem {
                    return new TreeviewItem({
                        text: item.text,
                        value: item.value,
                        children: item.internalChildren?.length ? mapTreeviewItems(item.internalChildren) : null,
                        collapsed: item.internalCollapsed,
                        disabled: item.internalDisabled
                    });
                }
            })
        );

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

    getTriageDataByDettaglioTipologia(): void {
        this.subscription.add(
            this.triageDataByDettaglioTipologia$.subscribe((triageData: ItemTriageData[]) => {
                if (triageData) {
                    this.tItemsData = triageData;
                }
            })
        );
    }

    getEditMode(): void {
        this.subscription.add(
            this.editMode$.subscribe((value: boolean) => {
                this.editMode = value;
            })
        );
    }

    initTriage(): void {
        this.addItem();
    }

    getItemData(item: TreeItem): any {
        const itemData = this.tItemsData?.length && this.tItemsData.filter((data: any) => data.itemValue === item.value)[0];
        if (itemData) {
            return itemData;
        }
    }

    toggleViewEditButtons(): void {
        this.viewEditButtons = !this.viewEditButtons;
    }

    addItem(item?: TreeItem): void {
        if (this.viewEditButtons || !item) {
            const addItemTriageModal = this.modalService.open(ItemTriageModalComponent, {
                windowClass: 'modal-holder',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                size: 'lg'
            });

            if (this.tItems) {
                const itemValueToFind = item.value.slice(2);
                addItemTriageModal.componentInstance.domandaTitle = this.findItem(this.tItems[0], itemValueToFind)?.text;
                addItemTriageModal.componentInstance.rispostaTitle = item.text;
            }
            addItemTriageModal.componentInstance.primaDomanda = !this.tItems;
            addItemTriageModal.componentInstance.item = item;
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
        this.toggleViewEditButtons();
        this.unsavedModifiche = true;
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
        this.unsavedModifiche = true;
    }

    addOtherData(res: any, item: TreeItem): void {
        const itemData = {
            itemValue: item.value,
            soccorsoAereo: null,
            generiMezzo: null,
            prioritaConsigliata: null
        } as ItemTriageData;
        if (res.data.soccorsoAereo) {
            itemData.soccorsoAereo = res.data.soccorsoAereo;
        }
        if (res.data.generiMezzo) {
            itemData.generiMezzo = res.data.generiMezzo;
        }
        if (res.data.prioritaConsigliata) {
            itemData.prioritaConsigliata = res.data.prioritaConsigliata;
        }
        if (otherDataValues(itemData)) {
            this.store.dispatch(new AddTriageData(itemData));
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
        if (this.tItems) {
            const itemValueToFind = item.value.slice(2);
            addItemTriageModal.componentInstance.domandaTitle = this.findItem(this.tItems[0], itemValueToFind)?.text;
            addItemTriageModal.componentInstance.rispostaTitle = item.text;
        }
        addItemTriageModal.componentInstance.primaDomanda = false;
        addItemTriageModal.componentInstance.editMode = true;
        addItemTriageModal.componentInstance.disableDomanda = item.children && item.children.length;
        addItemTriageModal.componentInstance.domandaSeguente = item?.children?.length ? item.children[0].text : null;
        addItemTriageModal.componentInstance.itemDataEdit = this.getItemData(item);
        addItemTriageModal.componentInstance.item = item;
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

                let newItemData: ItemTriageData;
                if (itemDataFound) {
                    newItemData = {
                        itemValue: item.value,
                        soccorsoAereo: itemDataFound.soccorsoAereo ? itemDataFound.soccorsoAereo : null,
                        generiMezzo: itemDataFound.generiMezzo ? itemDataFound.generiMezzo : null,
                        prioritaConsigliata: itemDataFound.prioritaConsigliata ? itemDataFound.prioritaConsigliata : null
                    };
                } else {
                    newItemData = {
                        itemValue: item.value,
                        soccorsoAereo: null,
                        generiMezzo: null,
                        prioritaConsigliata: null
                    };
                }

                if (res.data.soccorsoAereo) {
                    newItemData.soccorsoAereo = res.data.soccorsoAereo;
                } else {
                    newItemData.soccorsoAereo = null;
                }
                if (res.data.generiMezzo) {
                    newItemData.generiMezzo = res.data.generiMezzo;
                } else {
                    newItemData.generiMezzo = null;
                }
                if (res.data.prioritaConsigliata) {
                    newItemData.prioritaConsigliata = res.data.prioritaConsigliata;
                } else {
                    newItemData.prioritaConsigliata = null;
                }

                if (itemDataFound) {
                    this.store.dispatch(new DeleteTriageData(item.value));
                }

                if (newItemData.soccorsoAereo || newItemData.generiMezzo?.length || newItemData.prioritaConsigliata) {
                    this.store.dispatch(new AddTriageData(newItemData));
                }
                this.updateTriage(this.tItems[0]);
            }
        });
    }

    setItemValueEditTitle(item: TreeItem): void {
        this.itemValueTitleEdit = item.value;
        this.itemTitleEdit = item.text;
    }

    clearItemValueEditTitle(): void {
        this.itemValueTitleEdit = null;
        this.itemTitleEdit = null;
    }

    updateItemTitle(item: TreeItem): void {
        item.text = addQuestionMark(capitalize(this.itemTitleEdit));
        this.clearItemValueEditTitle();
        this.updateTriage(this.tItems[0]);
    }

    removeItem(item: TreeviewItem): void {
        const parent = this.findItem(this.tItems[0], item.value.slice(0, -2));
        parent.children = null;
        this.tItemsData = this.removeItemData(item);
        this.updateTriage(this.tItems[0]);
        this.store.dispatch(new SetNewTriageData(this.tItemsData));
    }

    removeItemData(item: TreeItem): ItemTriageData[] {
        const itemsData = makeCopy(this.tItemsData);
        // Rimuovo "data" dell'item
        removeData(itemsData, item);
        // Rimuovo "data" dei figli/sottofigli e così via
        removeDataRecursively(itemsData, item, item.value);

        return itemsData;

        function removeData(tItemsData: ItemTriageData[], element: TreeItem): void {
            let index = 0;
            let iItemDataFound: number;
            let deleteItemData: boolean;
            for (const tItemData of tItemsData) {
                if (tItemData.itemValue === element.value) {
                    iItemDataFound = index;
                    deleteItemData = true;
                }
                index = index + 1;
            }
            if (deleteItemData) {
                tItemsData.splice(iItemDataFound, 1);
            }
        }

        function removeDataRecursively(tItemsData: ItemTriageData[], element: TreeItem, value: string): void {
            removeData(tItemsData, element);
            if (element.children != null) {
                let i: number;
                let result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = removeDataRecursively(tItemsData, element.children[i], value);
                }
                return result;
            }
            return null;
        }
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

    updateTriage(triage: TreeItem): void {
        this.store.dispatch(new SetNewTriage(makeCopy(triage)));
    }

    saveTriage(): void {
        if (this.viewEditButtons) {
            this.toggleViewEditButtons();
        }
        this.editMode ? this.store.dispatch(new UpdateTriage()) : this.store.dispatch(new AddTriage());
        this.unsavedModifiche = false;
    }
}
