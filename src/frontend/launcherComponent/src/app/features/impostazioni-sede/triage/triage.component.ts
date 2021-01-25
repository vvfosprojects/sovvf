import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
    SetDettaglioTipologiaTriage
} from '../../../shared/store/actions/triage/triage.actions';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TriageState } from '../../../shared/store/states/triage/triage.state';
import { DettaglioTipologia } from '../../../shared/interface/dettaglio-tipologia.interface';
import { ItemTriageModalComponent } from '../../../shared/modal/item-triage-modal/item-triage-modal.component';
import { addQuestionMark, capitalize } from '../../../shared/helper/function';

@Component({
    selector: 'app-triage',
    templateUrl: './triage.component.html',
    styleUrls: ['./triage.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TriageComponent implements OnInit {

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

    ngOnInit(): void {
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
        addItemTriageModal.componentInstance.primaDomanda = !this.tItems;
        addItemTriageModal.componentInstance.tItem = item;
        addItemTriageModal.result.then((res: { success: boolean, data: any }) => {
            if (res.success) {
                if (this.tItems) {
                    if (res.data.domandaSeguente) {
                        this.addDomandaSeguente(item, res.data.domandaSeguente);
                    }
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
                    if (otherData) {
                        this.tItemsData.push(otherData);
                    }
                } else {
                    this.addPrimaDomanda(res.data.domandaSeguente);
                }
            }
        });
        console.log('TRIAGE', this.tItems);
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
    }

    addDomandaSeguente(item: TreeItem, domandaSeguente: string): void {
        item.children = [{
            text: addQuestionMark(capitalize(domandaSeguente)),
            value: item.value + '-1',
            children: [
                { text: 'Si', value: '1' + item.value + '-1', disabled: true },
                { text: 'No', value: '2' + item.value + '-1', disabled: true },
                { text: 'Non lo so', value: '3' + item.value + '-1', disabled: true }
            ]
        }];
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
                if (res.data.domandaSeguente) {
                    this.addDomandaSeguente(item, res.data.domandaSeguente);
                }

                // TODO: rivedere logica edit (funziona solo con il primo elemento)
                /* let iItemDataFound = 0;
                let itemDataFound: any;
                for (const tItemData of this.tItemsData) {
                    iItemDataFound = iItemDataFound++;
                    if (tItemData.itemValue === res.value) {
                        itemDataFound = tItemData;
                    } else {
                        itemDataFound = null;
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

                if (res.soccorsoAereo) {
                    editedItem.soccorsoAereo = res.soccorsoAereo;
                } else {
                    editedItem.soccorsoAereo = null;
                }
                if (res.generiMezzo) {
                    editedItem.generiMezzo = res.generiMezzo;
                } else {
                    editedItem.generiMezzo = null;
                }
                if (res.prioritaConsigliata) {
                    editedItem.prioritaConsigliata = res.prioritaConsigliata;
                } else {
                    editedItem.prioritaConsigliata = null;
                }

                if (itemDataFound) {
                    this.tItemsData[iItemDataFound] = editedItem;
                } else {
                    this.tItemsData.push(editedItem);
                } */
            }
        });
    }

    removeItem(item: TreeviewItem): void {
        console.log('removeItem', item);
    }

    saveTriage(): void {
        console.log('Triage', this.tItems);
    }
}
