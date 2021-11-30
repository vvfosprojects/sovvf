import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ricerca-pos',
    templateUrl: './ricerca-pos.component.html',
    styleUrls: ['./ricerca-pos.component.css']
})
export class RicercaPosComponent {

    @Input() ricerca: string;
    @Input() loading: boolean;

    @Output() ricercaChange = new EventEmitter<any>();

    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
    }

}
