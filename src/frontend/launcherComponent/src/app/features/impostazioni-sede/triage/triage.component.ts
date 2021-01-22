import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TreeItem, TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddItemTriageModalComponent } from '../../../shared/modal/add-item-triage-modal/add-item-triage-modal.component';

@Component({
    selector: 'app-triage',
    templateUrl: './triage.component.html',
    styleUrls: ['./triage.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TriageComponent implements OnInit {

    tConfig = {
        hasAllCheckBox: false,
        hasFilter: false,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 500
    } as TreeviewConfig;

    dettaglioTipologiaTriage: any;
    showTriage: boolean;

    tItems: TreeviewItem[];
    tItemsData = [];

    constructor(private modalService: NgbModal) {
    }

    ngOnInit(): void {
    }

    onDettaglioTipologiaTriage(dettaglioTipologiaTriage: any): void {
        this.dettaglioTipologiaTriage = dettaglioTipologiaTriage;
        if (!dettaglioTipologiaTriage) {
            this.onClearDettaglioTipologiaTriage();
        }
    }

    onClearDettaglioTipologiaTriage(): void {
        this.dettaglioTipologiaTriage = null;
        this.tItems = null;
        this.tItemsData = [];
        this.showTriage = false;
    }

    onShowTriage(): void {
        if (this.dettaglioTipologiaTriage) {
            this.showTriage = true;
        }
    }

    initTriage(): void {
        this.addItem();
    }

    getItemData(itemValue: string): any {
        const itemData = this.tItemsData.filter((data: any) => data.itemValue === itemValue)[0];
        if (itemData) {
            return itemData;
        }
    }

    addItem(item?: TreeItem): void {
        const addItemTriageModal = this.modalService.open(AddItemTriageModalComponent, {
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
    }

    removeItem(item: TreeviewItem): void {
        console.log('removeItem', item);
    }

}
