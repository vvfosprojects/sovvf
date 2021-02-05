import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColoriStatoMezzo } from '../../helper/_colori';
import { Mezzo } from '../../model/mezzo.model';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { statoMezzoColor } from '../../helper/function';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { MezzoActionEmit } from '../../interface/mezzo-action-emit.interface';

@Component({
    selector: 'app-mezzo',
    templateUrl: './mezzo.component.html',
    styleUrls: ['./mezzo.component.scss']
})
export class MezzoComponent {

    @Input() mezzo: Mezzo;
    @Input() mostraIndicatori: boolean;
    @Input() mostraNotifiche: boolean;
    @Input() mostraRichiestaAssociata: boolean;
    @Input() actionsAttive: boolean;

    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter();
    stato = new ColoriStatoMezzo();

    storicoStati: any[] = [{
      state: 'In Viaggio',
      time: '08:00'
    }];

  constructor(popoverConfig: NgbPopoverConfig,
              tooltipConfig: NgbTooltipConfig) {
        popoverConfig.container = 'body';
        popoverConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.placement = 'top';
    }

    nessunIndMezzo(mezzo): boolean {
        if (
            !mezzo.descrizioneStatoEfficienza &&
            !mezzo.descrizioneLivelloCarburante &&
            !mezzo.descrizioneLivelloEstinguente &&
            !mezzo.descrizioneAppartenenza
        ) {
            return true;
        }
    }

    dettagliMezzo(stato: string | number, tipostato: string, classe: string): string {
        return this.stato.getColor(stato, tipostato, classe);
    }

    onActionMezzo(action?: MezzoActionEmit): void {
        let actionMezzo: MezzoActionInterface;
        if (action) {
            let data = new Date();
            const orario = action.oraEvento;
            data.setHours(orario.ora);
            data.setMinutes(orario.minuti);
            data.setSeconds(0);
            data.setMilliseconds(0);
            data = new Date(data.getTime());
            actionMezzo = { mezzo: this.mezzo, action: action.mezzoAction, data };
        } else {
            actionMezzo = { mezzo: this.mezzo, action: null };
        }
        const ora = action.oraEvento.ora + ':' + action.oraEvento.minuti;
        const obj = {
          state: action.mezzoAction,
          time: ora
        };
        this.storicoStati.push(obj);
        console.log('***MEZZO ACTIONS DATA: ' , actionMezzo);
        this.actionMezzo.emit(actionMezzo);
    }

    statoMezzoColor(stato: StatoMezzo): string {
        return statoMezzoColor(stato);
    }

}
