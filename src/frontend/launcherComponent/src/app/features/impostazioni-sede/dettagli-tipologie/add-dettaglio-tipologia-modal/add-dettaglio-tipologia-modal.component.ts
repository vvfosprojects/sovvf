import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-dettaglio-tipologia-modal',
    templateUrl: './add-dettaglio-tipologia-modal.component.html',
    styleUrls: ['./add-dettaglio-tipologia-modal.component.scss']
})
export class AddDettaglioTipologiaModalComponent implements OnInit {

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }

}
