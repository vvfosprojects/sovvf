import { Component, OnInit } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-item-triage-modal',
    templateUrl: './add-item-triage-modal.component.html',
    styleUrls: ['./add-item-triage-modal.component.scss']
})
export class AddItemTriageModalComponent implements OnInit {

    tItem: TreeviewItem;
    prossimaDomanda: string;

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
        console.log('tItem', this.tItem);
    }

    onConferma(): void {
        const item = {
            value: this.tItem.value,
            prossimaDomanda: this.prossimaDomanda
        };
        this.modal.close(item);
    }
}
