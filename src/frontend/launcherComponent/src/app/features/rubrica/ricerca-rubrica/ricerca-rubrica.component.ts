import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ricerca-rubrica',
    templateUrl: './ricerca-rubrica.component.html',
    styleUrls: ['./ricerca-rubrica.component.css']
})
export class RicercaRubricaComponent implements OnInit {

    @Input() loading: boolean;
    ricerca: string;

    @Output() ricercaChange = new EventEmitter<any>();

    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
    }

    ngOnInit(): void {
    }

}
