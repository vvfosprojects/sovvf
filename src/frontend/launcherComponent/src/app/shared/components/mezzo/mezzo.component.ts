import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColoriStatoMezzo } from '../../helper/_colori';
import { Mezzo } from '../../model/mezzo.model';
import { HelperComposizione } from '../../../features/home/composizione-partenza/shared/helper/_helper-composizione';
import { NgbPopoverConfig, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoMezzoActions } from '../../enum/stato-mezzo-actions.enum';
import { statoMezzoColor } from '../../helper/function';

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
    @Input() inGestione: boolean;

    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter();
    stato = new ColoriStatoMezzo();
    methods = new HelperComposizione();

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

    onActionMezzo(action?: StatoMezzoActions) {
        let actionMezzo = {} as MezzoActionInterface;
        if (action) {
            actionMezzo = { 'mezzo': this.mezzo, 'action': action };
        } else {
            actionMezzo = { 'mezzo': this.mezzo, 'action': null };
        }
        this.actionMezzo.emit(actionMezzo);
        // console.log('Mezzo ' + this.mezzo.descrizione + ' arrivato sul posto.');
    }

    statoMezzoColor(stato: string) {
        return statoMezzoColor(stato);
    }
}
