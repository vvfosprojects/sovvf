import { Component, OnInit } from '@angular/core';
import { Fonogramma } from '../../model/fonogramma.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-dettaglio-fonogramma-modal',
    templateUrl: './dettaglio-fonogramma-modal.component.html',
    styleUrls: ['./dettaglio-fonogramma-modal.component.css']
})
export class DettaglioFonogrammaModalComponent implements OnInit {

    codiceRichiesta: string;
    fonogramma: Fonogramma;

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit() {
    }

}
