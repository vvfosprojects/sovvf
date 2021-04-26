import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ColoriStatoMezzo } from '../../helper/_colori';
import { Mezzo } from '../../model/mezzo.model';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { MezzoActionEmit } from '../../interface/mezzo-action-emit.interface';
import { EventoMezzo } from '../../interface/evento-mezzo.interface';
import { statoMezzoColor } from '../../helper/function-mezzo';

@Component({
    selector: 'app-mezzo',
    templateUrl: './mezzo.component.html',
    styleUrls: ['./mezzo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MezzoComponent {

    @Input() mezzo: Mezzo;
    @Input() listaEventi: any;
    @Input() mostraIndicatori: boolean;
    @Input() mostraNotifiche: boolean;
    @Input() mostraRichiestaAssociata: boolean;
    @Input() actionsAttive: boolean;
    @Input() mezzoInServizioPage: boolean;
    @Input() listaEventiMezzo: EventoMezzo[];

    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter();
    stato = new ColoriStatoMezzo();

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
            const dataEvento = action.dataEvento;
            data.setDate(dataEvento.giorno);
            data.setMonth(dataEvento.mese - 1);
            data.setFullYear(dataEvento.anno);
            data.setHours(orario.ora);
            data.setMinutes(orario.minuti);
            data.setSeconds(orario.secondi);
            data.setMilliseconds(0);
            data = new Date(data.getTime());
            actionMezzo = { mezzo: this.mezzo, action: action.mezzoAction, data, chiudereIntervento:  action.chiudereIntervento };
        } else {
            actionMezzo = { mezzo: this.mezzo, action: null };
        }
        this.actionMezzo.emit(actionMezzo);
    }

    statoMezzoColor(stato: StatoMezzo): string {
        return statoMezzoColor(stato);
    }

}
