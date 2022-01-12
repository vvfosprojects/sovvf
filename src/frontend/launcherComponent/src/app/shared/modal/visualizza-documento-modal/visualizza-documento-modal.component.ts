import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-visualizza-documento-modal',
    templateUrl: './visualizza-documento-modal.component.html',
    styleUrls: ['./visualizza-documento-modal.component.css']
})
export class VisualizzaDocumentoModalComponent implements OnInit {

    titolo: string;
    blob: Blob;

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    close(esito: string): void {
        this.modal.close(esito);
    }
}
