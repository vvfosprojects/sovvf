import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ricerca-area-documentale',
    templateUrl: './ricerca-area-documentale.component.html',
    styleUrls: ['./ricerca-area-documentale.component.css']
})
export class RicercaAreaDocumentaleComponent {

    @Input() ricerca: string;
    @Input() loading: boolean;

    @Output() ricercaChange = new EventEmitter<any>();

    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
    }

}
