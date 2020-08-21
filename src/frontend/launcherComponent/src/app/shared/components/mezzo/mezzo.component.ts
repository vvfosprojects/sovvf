import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColoriStatoMezzo } from '../../helper/_colori';
import { Mezzo } from '../../model/mezzo.model';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { statoMezzoColor } from '../../helper/function';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { MezzoActionEmit } from '../../interface/mezzo-action-emit.interface';
import { OFFSET_SYNC_TIME } from '../../../core/settings/referral-time';

@Component({
    selector: 'app-mezzo',
    templateUrl: './mezzo.component.html',
    styleUrls: ['./mezzo.component.scss']
})
export class MezzoComponent implements OnInit {

    @Input() mezzo: Mezzo;

    @Input() mostraIndicatori: boolean;
    @Input() mostraNotifiche: boolean;
    @Input() mostraRichiestaAssociata: boolean;
    @Input() actionsAttive: boolean;

    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter();
    stato = new ColoriStatoMezzo();

    constructor(popoverConfig: NgbPopoverConfig,
                tooltipConfig: NgbTooltipConfig) {
        popoverConfig.container = 'body';
        popoverConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'top';
    }

    ngOnInit() {
    }

    nessunIndMezzo(mezzo) {
        if (
            !mezzo.descrizioneStatoEfficienza &&
            !mezzo.descrizioneLivelloCarburante &&
            !mezzo.descrizioneLivelloEstinguente &&
            !mezzo.descrizioneAppartenenza
        ) {
            return true;
        }
    }

    dettagliMezzo(stato, tipostato, classe) {
        return this.stato.getColor(stato, tipostato, classe);
    }

    onActionMezzo(action?: MezzoActionEmit) {
        let actionMezzo: MezzoActionInterface;
        if (action) {
            let data = new Date();
            const orario = action.oraEvento;
            data.setHours(orario.ora);
            data.setMinutes(orario.minuti);
            data.setSeconds(0);
            data.setMilliseconds(0);
            data = new Date(data.getTime() + OFFSET_SYNC_TIME[0]);
            actionMezzo = { 'mezzo': this.mezzo, 'action': action.mezzoAction, 'data': data };
        } else {
            actionMezzo = { 'mezzo': this.mezzo, 'action': null };
        }
        this.actionMezzo.emit(actionMezzo);
    }

    statoMezzoColor(stato: StatoMezzo) {
        return statoMezzoColor(stato);
    }
}
