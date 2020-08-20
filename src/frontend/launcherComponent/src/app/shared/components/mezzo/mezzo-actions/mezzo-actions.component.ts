import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbTooltipConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Mezzo } from '../../../model/mezzo.model';
import { calcolaActionSuggeritaMezzo, statoMezzoActionColor, statoMezzoActionsEnumToStringArray } from '../../../helper/function';
import { StatoMezzoActions } from '../../../enum/stato-mezzo-actions.enum';
import { StatoMezzo } from 'src/app/shared/enum/stato-mezzo.enum';
import { MezzoActionsModalComponent } from 'src/app/shared/modal/mezzo-actions-modal/mezzo-actions-modal.component';
import { MezzoActionEmit } from '../../../interface/mezzo-action-emit.interface';

@Component({
    selector: 'app-mezzo-actions',
    templateUrl: './mezzo-actions.component.html',
    styleUrls: ['./mezzo-actions.component.css']
})
export class MezzoActionsComponent implements OnInit {

    @Input() mezzo: Mezzo;
    statoMezzoActions: StatoMezzoActions;
    statoMezzoString: Array<string>;

    @Output() actionMezzo: EventEmitter<MezzoActionEmit> = new EventEmitter<MezzoActionEmit>();

    constructor(
        dropdownConfig: NgbDropdownConfig,
        tooltipConfig: NgbTooltipConfig,
        private modalService: NgbModal
    ) {
        dropdownConfig.container = 'body';
        dropdownConfig.placement = 'top';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'top';
    }

    ngOnInit() {
        this.statoMezzoString = statoMezzoActionsEnumToStringArray([this.mezzo.stato, StatoMezzo.Istituto, calcolaActionSuggeritaMezzo(this.mezzo.stato)]);
    }

    onClick(action?: string) {
        this.modalService.open(MezzoActionsModalComponent, {
            windowClass: 'smModal',
            backdropClass: 'light-blue-backdrop',
            centered: true
        }).result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    if (action) {
                        this.statoMezzoActions = StatoMezzoActions[action.replace(' ', '')];
                        const orario = res.result.oraEvento;
                        this.actionMezzo.emit({ mezzoAction: this.statoMezzoActions, oraEvento: { ora: orario.hour, minuti: orario.minute } });
                    } else {
                        this.actionMezzo.emit();
                    }
                    break;
                case 'ko':
                    break;
            }
        });
    }

    calcolaActionSuggeritaMezzo(stato: StatoMezzo) {
        return calcolaActionSuggeritaMezzo(stato);
    }

    getBtnColor(stato: StatoMezzo) {
        return statoMezzoActionColor(calcolaActionSuggeritaMezzo(stato));
    }
}
