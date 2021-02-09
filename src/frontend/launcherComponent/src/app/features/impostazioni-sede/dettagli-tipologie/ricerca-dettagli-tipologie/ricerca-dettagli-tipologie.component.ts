import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ricerca-dettagli-tipologie',
    templateUrl: './ricerca-dettagli-tipologie.component.html',
    styleUrls: ['./ricerca-dettagli-tipologie.component.css']
})
export class RicercaDettagliTipologieComponent {

    @Input() loading: boolean;
    ricerca: string;

    @Output() ricercaChange = new EventEmitter<any>();

    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
    }

}
