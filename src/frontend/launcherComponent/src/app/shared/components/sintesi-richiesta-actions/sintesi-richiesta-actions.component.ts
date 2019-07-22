import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { StatoMezzoActions } from '../../enum/stato-mezzo-actions.enum';

@Component({
    selector: 'app-sintesi-richiesta-actions',
    templateUrl: './sintesi-richiesta-actions.component.html',
    styleUrls: ['./sintesi-richiesta-actions.component.css']
})
export class SintesiRichiestaActionsComponent implements OnInit {

    statoRichiesta = StatoRichiesta;

    @Output() actionRichiesta: EventEmitter<StatoRichiesta> = new EventEmitter();

    constructor(dropdownConfig: NgbDropdownConfig,
                tooltipConfig: NgbTooltipConfig) {
        dropdownConfig.container = 'body';
        dropdownConfig.placement = 'top';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'top';
    }

    ngOnInit() {
    }

    onClick(stato: StatoRichiesta) {
        this.actionRichiesta.emit(stato);
    }
}
