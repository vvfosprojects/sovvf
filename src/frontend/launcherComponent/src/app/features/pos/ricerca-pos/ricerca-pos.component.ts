import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ricerca-pos',
    templateUrl: './ricerca-pos.component.html',
    styleUrls: ['./ricerca-pos.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RicercaPosComponent {

    @Input() loading: boolean;

    @Output() ricercaChange = new EventEmitter<any>();

    ricerca: string;

    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
    }

}
