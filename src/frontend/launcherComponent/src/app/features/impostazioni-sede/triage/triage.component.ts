import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
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
    UpdateTriage,
    SetNewTriageData,
    GetGeneriMezzo,
    ResetTriage,
    ClearStateTriageCrud
} from '../../../shared/store/actions/triage-crud/triage-crud.actions';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TriageCrudState } from '../../../shared/store/states/triage-crud/triage-crud.state';
import { DettaglioTipologia } from '../../../shared/interface/dettaglio-tipologia.interface';
import { ItemTriageModalComponent } from '../../../shared/modal/item-triage-modal/item-triage-modal.component';
import { addQuestionMark, capitalize, makeCopy } from '../../../shared/helper/function-generiche';
import { ItemTriageData } from '../../../shared/interface/item-triage-data.interface';
import { ConfirmModalComponent } from '../../../shared/modal/confirm-modal/confirm-modal.component';
import { ImpostazioniState } from '../../../shared/store/states/impostazioni/impostazioni.state';
import { ImportTriageModalComponent } from './import-triage-modal/import-triage-modal.component';

@Component({
    selector: 'app-triage',
    templateUrl: './triage.component.html',
    styleUrls: ['./triage.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TriageComponent implements OnDestroy {

    tConfig = {
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 500
    } as TreeviewConfig;

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;

    @Select(TipologieState.tipologie) tipologie$: Observable<Tipologia[]>;

    @Select(TriageCrudState.dettagliTipologie) dettagliTipologie$: Observable<DettaglioTipologia[]>;
    @Select(TriageCrudState.dettaglioTipologia) dettaglioTipologia$: Observable<DettaglioTipologia>;
    dettaglioTipologia: DettaglioTipologia;
    @Select(TriageCrudState.triageByDettaglioTipologia) triageByDettaglioTipologia$: Observable<TreeviewItem>;
    tItems: any;
    @Select(TriageCrudState.triageDataByDettaglioTipologia) triageDataByDettaglioTipologia$: Observable<ItemTriageData[]>;
    tItemsData: ItemTriageData[];
    @Select(TriageCrudState.editMode) editMode$: Observable<boolean>;
    editMode: boolean;

    @Select(TriageCrudState._backupTriageByDettaglioTipologia) backupTriageByDettaglioTipologia$: Observable<TreeItem>;
    tItemsBackup: TreeItem[];
    @Select(TriageCrudState._backupTriageDataByDettaglioTipologia) backupTriageDataByDettaglioTipologia$: Observable<ItemTriageData[]>;
    tItemsDataBackup: ItemTriageData[];

    codTipologia: string;
    codDettaglioTipologia: number;

    showTriage: boolean;

    viewEditButtons = true;
    alertModificheDaSalvare = true;

    itemValueTitleEdit: string;
    itemTitleEdit: string;

    private subscription = new Subscription();

    constructor(private store: Store,
                private modalService: NgbModal,
                private selectConfig: NgSelectConfig) {
        selectConfig.appendTo = 'body';
        selectConfig.notFoundText = 'Nessun elemento trovato';
        this.getDettaglioTipologia();
        this.getEditMode();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearStateTriageCrud());
    }

    getDettaglioTipologia(): void {
        this.dettaglioTipologia$.subscribe((dettaglioTipologia: DettaglioTipologia) => {
            this.dettaglioTipologia = dettaglioTipologia;
        });
    }

    getTItems(): TreeviewItem[] {
        return [new TreeviewItem(this.tItems[0])];
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

    onResetRicerca(): void {
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
            this.triageByDettaglioTipologia$.subscribe((triage: TreeItem) => {
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
                } else {
                    this.tItems = null;
                }
            })
        );
        this.subscription.add(
            this.backupTriageByDettaglioTipologia$.subscribe((backupTriage: TreeItem) => {
                if (backupTriage) {
                    let index = 0;
                    const mappedTriage = [];
                    const triageArray = [makeCopy(backupTriage)];
                    for (const item of triageArray) {
                        index = index + 1;
                        mappedTriage[0] = getFatherMapped(item);
                    }
                    this.tItemsBackup = [];
                    this.tItemsBackup[0] = mappedTriage[0];
                } else {
                    this.tItemsBackup = null;
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

    getTriageDataByDettaglioTipologia(): void {
        this.subscription.add(
            this.triageDataByDettaglioTipologia$.subscribe((triageData: ItemTriageData[]) => {
                if (triageData) {
                    this.tItemsData = triageData;
                }
            })
        );
        this.subscription.add(
            this.backupTriageDataByDettaglioTipologia$.subscribe((backupTriageData: ItemTriageData[]) => {
                if (backupTriageData) {
                    this.tItemsDataBackup = backupTriageData;
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

    importTriage(): void {
        this.modalService.open(ImportTriageModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
    }

    getItemData(item: TreeItem): ItemTriageData {
        const itemData = this.tItemsData?.length && this.tItemsData.filter((data: any) => data.itemValue === item.value)[0];
        if (itemData) {
            return itemData;
        }
    }

    toggleViewEditButtons(): void {
        this.viewEditButtons = !this.viewEditButtons;
        this.alertModificheDaSalvare = !!this.viewEditButtons;
    }

    addItem(item?: TreeItem): void {
        if (this.viewEditButtons || !item) {
            this.store.dispatch(new GetGeneriMezzo());
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

            if (item) {
                getParentItemDataAdd(item.value, this.tItems[0], this.tItemsData, addItemTriageModal);
            }

            addItemTriageModal.result.then((res: { success: boolean, data: any }) => {
                if (res.success) {
                    if (this.tItems) {
                        if (res.data.domandaSeguente) {
                            this.addDomandaSeguente(item, res.data.domandaSeguente, res.data.rispostePersonalizzate);
                        }
                        this.addOtherData(res, item);
                    } else {
                        this.addPrimaDomanda(res.data.domandaSeguente, res.data.rispostePersonalizzate);
                    }
                }
            });
        }

        function getParentItemDataAdd(itemValue, tItems, tItemsData, modal): void {
            if (itemValue) {
                const rispostaParentItemValue = itemValue.slice(2).slice(0, -2);
                if (rispostaParentItemValue) {
                    const rispostaParentItem = findItem(tItems, rispostaParentItemValue);
                    if (rispostaParentItem) {
                        const parentItemData = getItemData(rispostaParentItem, tItemsData);
                        if (parentItemData) {
                            modal.componentInstance.parentItemData = parentItemData;
                        } else {
                            getParentItemDataAdd(rispostaParentItemValue, tItems, tItemsData, modal);
                        }
                    }
                }
            }
        }

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

        function getItemData(item2: TreeItem, tItemsData: any): ItemTriageData {
            const itemData = tItemsData?.length && tItemsData.filter((data: any) => data.itemValue === item2.value)[0];
            if (itemData) {
                return itemData;
            }
        }
    }

    addPrimaDomanda(domanda: string, rispostePersonalizzate?: string[]): void {
        this.tItems = [
            new TreeviewItem({
                text: addQuestionMark(capitalize(domanda)),
                value: '1'
            })
        ];
        if (rispostePersonalizzate?.length) {
            rispostePersonalizzate.forEach((rispostaPersonalizzata: string, index: number) => {
                const risposta = {
                    text: rispostaPersonalizzata,
                    value: (index + 1) + '-' + this.tItems[0].value + '-1',
                    disabled: true
                };
                if (!this.tItems[0].children?.length) {
                    this.tItems[0].children = [risposta];
                } else {
                    this.tItems[0].children.push(risposta);
                }
            });
        } else {
            this.tItems[0].children = [
                { text: 'Si', value: '1-' + this.tItems[0].value + '-1', disabled: true },
                { text: 'No', value: '2-' + this.tItems[0].value + '-1', disabled: true },
                { text: 'Non lo so', value: '3-' + this.tItems[0].value + '-1', disabled: true }
            ];
        }
        this.updateTriage(this.tItems[0]);
        this.toggleViewEditButtons();
    }

    addDomandaSeguente(item: TreeItem, domandaSeguente: string, rispostePersonalizzate?: string[]): void {
        item.children = [
            new TreeviewItem({
                text: addQuestionMark(capitalize(domandaSeguente)),
                value: item.value + '-1'
            })
        ];
        if (rispostePersonalizzate?.length) {
            rispostePersonalizzate.forEach((rispostaPersonalizzata: string, index: number) => {
                const risposta = {
                    text: rispostaPersonalizzata,
                    value: (index + 1) + '-' + item.value + '-1',
                    disabled: true
                };
                if (!item.children[0].children?.length) {
                    item.children[0].children = [risposta];
                } else {
                    item.children[0].children.push(risposta);
                }
            });
        } else {
            item.children[0].children = [
                { text: 'Si', value: '1-' + item.value + '-1', disabled: true },
                { text: 'No', value: '2-' + item.value + '-1', disabled: true },
                { text: 'Non lo so', value: '3-' + item.value + '-1', disabled: true }
            ];
        }
        this.updateTriage(this.tItems[0]);
    }

    addOtherData(res: any, item: TreeItem): void {
        console.log('addOtherData', item);
        const itemData = {
            itemValue: item.value,
            soccorsoAereo: null,
            generiMezzo: null,
            prioritaConsigliata: null,
            noteOperatore: null,
            noteUtente: null
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
        if (res.data.noteOperatore) {
            itemData.noteOperatore = res.data.noteOperatore;
        }
        if (res.data.noteUtente) {
            itemData.noteUtente = res.data.noteUtente;
        }
        if (otherDataValues(itemData)) {
            this.store.dispatch(new AddTriageData(itemData));
        }

        function otherDataValues(data: any): boolean {
            return data?.soccorsoAereo || data?.generiMezzo || data?.prioritaConsigliata || data?.noteOperatore || data?.noteUtente;
        }
    }

    editItem(item: TreeItem): void {
        this.store.dispatch(new GetGeneriMezzo());
        const editItemTriageModal = this.modalService.open(ItemTriageModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        if (this.tItems) {
            const itemValueToFind = item.value.slice(2);
            editItemTriageModal.componentInstance.domandaTitle = this.findItem(this.tItems[0], itemValueToFind)?.text;
            editItemTriageModal.componentInstance.rispostaTitle = item.text;
        }
        editItemTriageModal.componentInstance.primaDomanda = false;
        editItemTriageModal.componentInstance.editMode = true;
        editItemTriageModal.componentInstance.disableDomanda = item.children && item.children.length;
        editItemTriageModal.componentInstance.domandaSeguente = item?.children?.length ? item.children[0].text : null;
        editItemTriageModal.componentInstance.itemDataEdit = this.getItemData(item);
        editItemTriageModal.componentInstance.item = item;

        if (item) {
            getParentItemDataEdit(item.value, this.tItems[0], this.tItemsData, editItemTriageModal);
        }

        editItemTriageModal.result.then((res: { success: boolean, data: any }) => {
            if (res.success) {
                if (!item.children && res.data.domandaSeguente) {
                    this.addDomandaSeguente(item, res.data.domandaSeguente, res.data.rispostePersonalizzate);
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
                        id: null,
                        codiceTipologia: null,
                        codiceDettaglioTipologia: null,
                        itemValue: item.value,
                        soccorsoAereo: itemDataFound.soccorsoAereo ? itemDataFound.soccorsoAereo : null,
                        generiMezzo: itemDataFound.generiMezzo ? itemDataFound.generiMezzo : null,
                        prioritaConsigliata: itemDataFound.prioritaConsigliata ? itemDataFound.prioritaConsigliata : null,
                        noteOperatore: itemDataFound.noteOperatore ? itemDataFound.noteOperatore : null,
                        noteUtente: itemDataFound.noteUtente ? itemDataFound.noteUtente : null,
                    };
                } else {
                    newItemData = {
                        id: null,
                        codiceTipologia: null,
                        codiceDettaglioTipologia: null,
                        itemValue: item.value,
                        soccorsoAereo: null,
                        generiMezzo: null,
                        prioritaConsigliata: null,
                        noteOperatore: null,
                        noteUtente: null
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
                if (res.data.noteOperatore) {
                    newItemData.noteOperatore = res.data.noteOperatore;
                } else {
                    newItemData.noteOperatore = null;
                }
                if (res.data.noteUtente) {
                    newItemData.noteUtente = res.data.noteUtente;
                } else {
                    newItemData.noteUtente = null;
                }

                if (itemDataFound) {
                    this.store.dispatch(new DeleteTriageData(item.value));
                }

                if (newItemData?.soccorsoAereo || newItemData.generiMezzo?.length || newItemData?.prioritaConsigliata || newItemData?.noteOperatore || newItemData?.noteUtente) {
                    this.store.dispatch(new AddTriageData(newItemData));
                }
                this.updateTriage(this.tItems[0]);
            }
        });

        function getParentItemDataEdit(itemValue, tItems, tItemsData, modal): void {
            if (itemValue) {
                const rispostaParentItemValue = itemValue.slice(2).slice(0, -2);
                if (rispostaParentItemValue) {
                    const rispostaParentItem = findItem(tItems, rispostaParentItemValue);
                    if (rispostaParentItem) {
                        const parentItemData = getItemData(rispostaParentItem, tItemsData);
                        if (parentItemData) {
                            modal.componentInstance.parentItemData = parentItemData;
                        } else {
                            getParentItemDataEdit(rispostaParentItemValue, tItems, tItemsData, modal);
                        }
                    }
                }
            }
        }

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

        function getItemData(item2: TreeItem, tItemsData: any): ItemTriageData {
            const itemData = tItemsData?.length && tItemsData.filter((data: any) => data.itemValue === item2.value)[0];
            if (itemData) {
                return itemData;
            }
        }
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
        let removeTriageItemModal;
        removeTriageItemModal = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'md'
        });
        removeTriageItemModal.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        removeTriageItemModal.componentInstance.titolo = 'Eliminazione "' + item.text + '"';
        removeTriageItemModal.componentInstance.messaggio = 'Sei sicuro di voler rimuovere "' + item.text + '" ?';
        removeTriageItemModal.componentInstance.messaggioAttenzione = 'Attenzione! Tutti i nodi sottostanti verranno eliminati.';

        removeTriageItemModal.result.then(
            (val: string) => {
                switch (val) {
                    case 'ok':
                        const parent = this.findItem(this.tItems[0], item.value.slice(0, -2));
                        parent.children = null;
                        this.tItemsData = this.removeItemData(item);
                        this.updateTriage(this.tItems[0]);
                        this.store.dispatch(new SetNewTriageData(this.tItemsData));
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

        function removeDataRecursively(tItemsData: ItemTriageData[], element: TreeItem, value: string): any {
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
        const newTriage = triage ? makeCopy(triage) : null;
        this.store.dispatch(new SetNewTriage(newTriage));
    }

    saveTriage(): void {
        if (this.viewEditButtons) {
            this.toggleViewEditButtons();
        }
        this.editMode ? this.store.dispatch(new UpdateTriage()) : this.store.dispatch(new AddTriage());
    }

    removeTriage(): void {
        let removeTriageModal;
        removeTriageModal = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        removeTriageModal.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        removeTriageModal.componentInstance.titolo = 'Eliminazione Triage di "' + this.dettaglioTipologia.descrizione + '"';
        removeTriageModal.componentInstance.messaggioAttenzione = 'Attenzione! Tutti i dati del Triage di "' + this.dettaglioTipologia.descrizione + '" verranno eliminati';

        removeTriageModal.result.then(
            (val: string) => {
                switch (val) {
                    case 'ok':
                        if (this.viewEditButtons) {
                            this.toggleViewEditButtons();
                        }
                        this.updateTriage(null);
                        this.store.dispatch(new UpdateTriage());
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

    resetTriage(): void {
        let resetTriageModal;
        resetTriageModal = this.modalService.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        resetTriageModal.componentInstance.icona = { descrizione: 'refresh', colore: 'secondary' };
        resetTriageModal.componentInstance.titolo = 'Reset Triage di "' + this.dettaglioTipologia.descrizione + '"';
        resetTriageModal.componentInstance.messaggio = 'Stai effettuando il reset delle modifiche al Triage di "' + this.dettaglioTipologia.descrizione + '"';
        resetTriageModal.componentInstance.messaggioAttenzione = 'Attenzione! Tutti i dati non salvati verranno persi';

        resetTriageModal.result.then(
            (val: string) => {
                switch (val) {
                    case 'ok':
                        this.store.dispatch(new ResetTriage());
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
