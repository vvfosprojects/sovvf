import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ricerca-area-documentale',
    templateUrl: './ricerca-area-documentale.component.html',
    styleUrls: ['./ricerca-area-documentale.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RicercaAreaDocumentaleComponent {

    @Input() loading: boolean;

    @Output() ricercaChange = new EventEmitter<any>();

    ricerca: string;

    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
    }

}
