import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { Mezzo } from '../../../model/mezzo.model';
import { calcolaActionSuggeritaMezzo, statoMezzoActionColor, statoMezzoActionsEnumToStringArray } from '../../../helper/function';
import { StatoMezzoActions } from '../../../enum/stato-mezzo-actions.enum';
import { StatoMezzo } from 'src/app/shared/enum/stato-mezzo.enum';

@Component({
    selector: 'app-mezzo-actions',
    templateUrl: './mezzo-actions.component.html',
    styleUrls: ['./mezzo-actions.component.css']
})
export class MezzoActionsComponent implements OnInit {

    @Input() mezzo: Mezzo;
    statoMezzoActions: StatoMezzoActions;
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
        this.statoMezzoString = statoMezzoActionsEnumToStringArray([this.mezzo.stato, StatoMezzo.Istituto, calcolaActionSuggeritaMezzo(this.mezzo.stato)]);
    }

    onClick(action?: string) {
        if (action) {
            this.statoMezzoActions = StatoMezzoActions[action.replace(' ', '')];
            this.actionMezzo.emit(this.statoMezzoActions);
        } else {
            this.actionMezzo.emit();
        }
    }

    calcolaActionSuggeritaMezzo(stato: StatoMezzo) {
        return calcolaActionSuggeritaMezzo(stato);
    }

    getBtnColor(stato: StatoMezzo) {
        return statoMezzoActionColor(calcolaActionSuggeritaMezzo(stato));
    }
}
