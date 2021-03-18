import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddDettaglioTipologiaModalComponent } from './add-dettaglio-tipologia-modal/add-dettaglio-tipologia-modal.component';

@Component({
    selector: 'app-dettagli-tipologie',
    templateUrl: './dettagli-tipologie.component.html',
    styleUrls: ['./dettagli-tipologie.component.scss']
})
export class DettagliTipologieComponent implements OnInit {

    constructor(private modalService: NgbModal) {
    }

    ngOnInit(): void {
    }

    addDettaglio(): void {
        const options: NgbModalOptions = {
            centered: true
        };
        this.modalService.open(AddDettaglioTipologiaModalComponent, options);
    }

}
