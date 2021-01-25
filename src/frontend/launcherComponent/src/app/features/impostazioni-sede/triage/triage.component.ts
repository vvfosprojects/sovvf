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
            if (item.children.length > 0) {
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
        addItemTriageModal.result.then((res: any) => {
            if (res.domandaSeguente) {
                if (this.tItems) {
                    item.children = [{
                        text: res.domandaSeguente,
                        value: item.value + '-1',
                        children: [
                            { text: 'Si', value: '1' + item.value + '-1', disabled: true },
                            { text: 'No', value: '2' + item.value + '-1', disabled: true },
                            { text: 'Non lo so', value: '3' + item.value + '-1', disabled: true }
                        ]
                    }];
                    const otherData = {
                        itemValue: item.value,
                        soccorsoAereo: null,
                        generiMezzo: null,
                        prioritaConsigliata: null
                    };
                    if (res.soccorsoAereo) {
                        otherData.soccorsoAereo = res.soccorsoAereo;
                    }
                    if (res.generiMezzo) {
                        otherData.generiMezzo = res.generiMezzo;
                    }
                    if (res.prioritaConsigliata) {
                        otherData.prioritaConsigliata = res.prioritaConsigliata;
                    }
                    if (otherData) {
                        this.tItemsData.push(otherData);
                    }
                } else {
                    this.tItems = [
                        new TreeviewItem({
                            text: res.domandaSeguente,
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
            }
        });
        console.log('TRIAGE', this.tItems);
    }

    editItem(item?: TreeItem): void {
        const addItemTriageModal = this.modalService.open(ItemTriageModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addItemTriageModal.componentInstance.primaDomanda = false;
        addItemTriageModal.componentInstance.itemEdit = this.getItemData(item);
        addItemTriageModal.componentInstance.tItem = item;
        addItemTriageModal.result.then((res: any) => {
            if (res.domandaSeguente) {
                if (this.tItems) {
                    item.children = [{
                        text: res.domandaSeguente,
                        value: item.value + '-1',
                        children: [
                            { text: 'Si', value: '1' + item.value + '-1', disabled: true },
                            { text: 'No', value: '2' + item.value + '-1', disabled: true },
                            { text: 'Non lo so', value: '3' + item.value + '-1', disabled: true }
                        ]
                    }];
                    const otherData = {
                        itemValue: item.value,
                        soccorsoAereo: null,
                        generiMezzo: null,
                        prioritaConsigliata: null
                    };
                    if (res.soccorsoAereo) {
                        otherData.soccorsoAereo = res.soccorsoAereo;
                    }
                    if (res.generiMezzo) {
                        otherData.generiMezzo = res.generiMezzo;
                    }
                    if (res.prioritaConsigliata) {
                        otherData.prioritaConsigliata = res.prioritaConsigliata;
                    }
                    if (otherData) {
                        this.tItemsData.push(otherData);
                    }
                } else {
                    this.tItems = [
                        new TreeviewItem({
                            text: res.domandaSeguente,
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
            }
        });
    }

    editItemText(item?: TreeItem): void {
        console.log('editItemText');
    }

    removeItem(item: TreeviewItem): void {
        console.log('removeItem', item);
    }

    saveTriage(): void {
        console.log('Triage', this.tItems);
    }
}
