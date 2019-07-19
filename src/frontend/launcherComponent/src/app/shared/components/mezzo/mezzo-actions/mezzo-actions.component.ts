import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Mezzo } from '../../../model/mezzo.model';
import { calcolaActionSuggeritaMezzo, statoMezzoColor, statoMezzoEnumToStringArray } from '../../../helper/function';
import { StatoMezzoActions } from '../../../enum/stato-mezzo-actions.enum';

@Component({
    selector: 'app-mezzo-actions',
    templateUrl: './mezzo-actions.component.html',
    styleUrls: ['./mezzo-actions.component.css']
})
export class MezzoActionsComponent implements OnInit {

    @Input() mezzo: Mezzo;
    statoMezzo: StatoMezzoActions;
    statoMezzoString: Array<string>;

    @Output() actionMezzo: EventEmitter<StatoMezzoActions> = new EventEmitter();

    constructor(dropdownConfig: NgbDropdownConfig,
                tooltipConfig: NgbTooltipConfig) {
        dropdownConfig.container = 'body';
        dropdownConfig.placement = 'top';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'top';
    }

    ngOnInit() {
        this.statoMezzoString = statoMezzoEnumToStringArray([this.mezzo.stato, calcolaActionSuggeritaMezzo(this.mezzo)]);
    }

    onClick(action?: string) {
        if (action) {
            this.statoMezzo = StatoMezzoActions[action.replace(' ', '')];
            this.actionMezzo.emit(this.statoMezzo);
        } else {
            this.actionMezzo.emit();
        }
    }

    calcolaActionSuggeritaMezzo(mezzo: Mezzo) {
        return calcolaActionSuggeritaMezzo(mezzo);
    }

    statoMezzoColor(mezzo: Mezzo) {
        return statoMezzoColor(mezzo.stato);
    }
}
