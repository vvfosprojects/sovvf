import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ricerca-rubrica-personale',
    templateUrl: './ricerca-rubrica-personale.component.html',
    styleUrls: ['./ricerca-rubrica-personale.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RicercaRubricaPersonaleComponent {

    @Input() loading: boolean;
    ricerca: string;

    @Output() ricercaChange = new EventEmitter<any>();

    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
    }

}
