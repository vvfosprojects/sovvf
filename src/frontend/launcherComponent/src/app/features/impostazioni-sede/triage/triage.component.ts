import { Component, OnInit } from '@angular/core';
import { TreeItem, TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddItemTriageModalComponent } from '../../../shared/modal/add-item-triage-modal/add-item-triage-modal.component';

@Component({
    selector: 'app-triage',
    templateUrl: './triage.component.html',
    styleUrls: ['./triage.component.scss']
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

    constructor(private modalService: NgbModal) {
    }

    ngOnInit(): void {
    }

    onDettaglioTipologiaTriage(dettaglioTipologiaTriage: any): void {
        this.dettaglioTipologiaTriage = dettaglioTipologiaTriage;
        if (!dettaglioTipologiaTriage) {
            this.showTriage = false;
        }
    }

    onShowTriage(): void {
        if (this.dettaglioTipologiaTriage) {
            this.showTriage = true;
        }
    }

    initTriage(): void {
        this.tItems = [
            new TreeviewItem({
                text: 'Ci sono persone in casa?',
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

    addDomanda(item: TreeItem): void {
        const addItemTriageModal = this.modalService.open(AddItemTriageModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addItemTriageModal.componentInstance.tItem = item;
        addItemTriageModal.result.then((res: any) => {
            item.children = [{
                text: res.prossimaDomanda,
                value: item.value + '-1',
                children: [
                    { text: 'Si', value: '1' + item.value + '-1', disabled: true },
                    { text: 'No', value: '2' + item.value + '-1', disabled: true },
                    { text: 'Non lo so', value: '3' + item.value + '-1', disabled: true }
                ]
            }];
        });

    }

    removeItem(item: TreeviewItem): void {
        console.log('removeItem', item);
    }

}
