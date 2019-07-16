import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { StatoMezzo } from '../../../enum/stato-mezzo.enum';
import { Mezzo } from '../../../model/mezzo.model';
import { calcolaActionSuggeritaMezzo, statoMezzoEnumToStringArray } from '../../../helper/function';

@Component({
    selector: 'app-mezzo-actions',
    templateUrl: './mezzo-actions.component.html',
    styleUrls: ['./mezzo-actions.component.css']
})
export class MezzoActionsComponent implements OnInit {

    @Input() mezzo: Mezzo;
    statoMezzo: StatoMezzo;
    statoMezzoString: Array<string>;

    @Output() actionMezzo: EventEmitter<StatoMezzo> = new EventEmitter();

    constructor(dropdownConfig: NgbDropdownConfig,
                tooltipConfig: NgbTooltipConfig) {
        dropdownConfig.container = 'body';
        dropdownConfig.placement = 'top';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'top';
    }

    ngOnInit() {
        this.statoMezzoString = statoMezzoEnumToStringArray();
    }

    onClick(action?: string) {
        if (action) {
            this.statoMezzo = StatoMezzo[action.replace(' ', '')];
            // console.log(this.statoMezzo);
            this.actionMezzo.emit(this.statoMezzo);
        } else {
            console.log('b');
            this.actionMezzo.emit();
        }
    }

    calcolaActionSuggeritaMezzo(mezzo: Mezzo) {
        return calcolaActionSuggeritaMezzo(mezzo);
    }
}
