import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ricerca-trasferimento-chiamata',
    templateUrl: './ricerca-trasferimento-chiamata.component.html',
    styleUrls: ['./ricerca-trasferimento-chiamata.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RicercaTrasferimentoChiamataComponent {

    @Input() loading: boolean;
    @Input() ricerca: string;

    @Output() ricercaChange = new EventEmitter<any>();

    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
    }
}
