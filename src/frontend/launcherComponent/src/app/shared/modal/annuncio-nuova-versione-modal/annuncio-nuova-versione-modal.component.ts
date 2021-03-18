import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-annuncio-nuova-versione-modal',
    templateUrl: './annuncio-nuova-versione-modal.component.html',
    styleUrls: ['./annuncio-nuova-versione-modal.component.css']
})
export class AnnuncioNuovaVersioneModalComponent implements OnInit {

    newVersionSoonInfo: string[];
    newVersionSoonData: string;

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    close(): void {
        this.modal.close({ status: 'ko' });
    }
}
