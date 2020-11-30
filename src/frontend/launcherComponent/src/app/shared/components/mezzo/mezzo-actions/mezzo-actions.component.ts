import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbTooltipConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Mezzo } from '../../../model/mezzo.model';
import { calcolaActionSuggeritaMezzo, statoMezzoActionColor, statoMezzoActionsEnumToStringArray } from '../../../helper/function';
import { StatoMezzoActions } from '../../../enum/stato-mezzo-actions.enum';
import { StatoMezzo } from 'src/app/shared/enum/stato-mezzo.enum';
import { MezzoActionsModalComponent } from 'src/app/shared/modal/mezzo-actions-modal/mezzo-actions-modal.component';
import { MezzoActionEmit } from '../../../interface/mezzo-action-emit.interface';
import {Select} from '@ngxs/store';
import {ViewportState} from '../../../store/states/viewport/viewport.state';
import {Observable, Subscription} from 'rxjs';

@Component({
    selector: 'app-mezzo-actions',
    templateUrl: './mezzo-actions.component.html',
    styleUrls: ['./mezzo-actions.component.css']
})
export class MezzoActionsComponent implements OnInit {

    @Input() mezzo: Mezzo;

    @Output() actionMezzo: EventEmitter<MezzoActionEmit> = new EventEmitter<MezzoActionEmit>();

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;

    statoMezzoActions: StatoMezzoActions;
    statoMezzoString: Array<string>;
    private subscription = new Subscription();

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

    ngOnInit(): void {
        this.statoMezzoString = statoMezzoActionsEnumToStringArray([this.mezzo.stato, StatoMezzo.Istituto, calcolaActionSuggeritaMezzo(this.mezzo.stato)]);
        this.subscription.add(this.doubleMonitor$.subscribe(r => this.doubleMonitor = r));
    }

    onClick(action?: string, event?: MouseEvent): void {
        if (event) {
            event.stopPropagation();
        }
        if (this.doubleMonitor) {
          this.modalService.open(MezzoActionsModalComponent, {
            windowClass: 'modal-holder modal-left',
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
        } else {
          this.modalService.open(MezzoActionsModalComponent, {
            windowClass: 'modal-holder',
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
    }

    calcolaActionSuggeritaMezzo(stato: StatoMezzo, event?: MouseEvent): StatoMezzoActions {
        if (event) {
            event.stopPropagation();
        }
        return calcolaActionSuggeritaMezzo(stato);
    }

    getBtnColor(stato: StatoMezzo): string {
        return statoMezzoActionColor(calcolaActionSuggeritaMezzo(stato));
    }
}
