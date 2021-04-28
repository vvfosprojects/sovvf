import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDropdownConfig, NgbTooltipConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Mezzo } from '../../../model/mezzo.model';
import { StatoMezzoActions } from '../../../enum/stato-mezzo-actions.enum';
import { StatoMezzo } from 'src/app/shared/enum/stato-mezzo.enum';
import { MezzoActionsModalComponent } from 'src/app/shared/modal/mezzo-actions-modal/mezzo-actions-modal.component';
import { MezzoActionEmit } from '../../../interface/mezzo-action-emit.interface';
import { calcolaActionSuggeritaMezzo, statoMezzoActionColor, statoMezzoActionsEnumToStringArray } from '../../../helper/function-mezzo';

@Component({
    selector: 'app-mezzo-actions',
    templateUrl: './mezzo-actions.component.html',
    styleUrls: ['./mezzo-actions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MezzoActionsComponent implements OnInit {

    @Input() mezzo: Mezzo;
    @Input() doubleMonitor: Mezzo;
    @Input() listaEventi: any;

    @Output() actionMezzo: EventEmitter<MezzoActionEmit> = new EventEmitter<MezzoActionEmit>();

    statoMezzoActions: StatoMezzoActions;
    statoMezzoString: Array<string>;

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
    }

    onClick(action?: string, event?: MouseEvent): void {
        if (event) {
            event.stopPropagation();
        }
        let modal;
        modal = this.modalService.open(MezzoActionsModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            size: 'lg',
            centered: true
        });
        modal.componentInstance.statoMezzo = this.mezzo.stato;
        modal.componentInstance.listaEventi = this.listaEventi;
        modal.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    if (action) {
                        this.statoMezzoActions = StatoMezzoActions[action.replace(' ', '')];
                        const orario = res.result.oraEvento;
                        const data = res.result.dataEvento;
                        const azioneIntervento = res.result.azioneIntervento;
                        this.actionMezzo.emit({
                            mezzoAction: this.statoMezzoActions,
                            oraEvento: { ora: orario.hour, minuti: orario.minute, secondi: orario.second },
                            dataEvento: { giorno: data.day, mese: data.month, anno: data.year },
                            azioneIntervento,
                        });
                    } else {
                        this.actionMezzo.emit();
                    }
                    break;
                case 'ko':
                    break;
            }
        });
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
