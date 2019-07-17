import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColoriStatoMezzo } from '../../helper/_colori';
import { Mezzo } from '../../model/mezzo.model';
import { HelperComposizione } from '../../../features/home/composizione-partenza/shared/helper/_helper-composizione';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';

@Component({
    selector: 'app-mezzo',
    templateUrl: './mezzo.component.html',
    styleUrls: ['./mezzo.component.scss']
})
export class MezzoComponent implements OnInit {

    @Input() mezzo: Mezzo;
    @Input() inGestione: boolean;

    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter();
    stato = new ColoriStatoMezzo();
    methods = new HelperComposizione();

    constructor(popoverConfig: NgbPopoverConfig) {
        popoverConfig.container = 'body';
        popoverConfig.placement = 'bottom';
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

    onActionMezzo(action?: StatoMezzo) {
        let actionMezzo = {} as MezzoActionInterface;
        if (action) {
            actionMezzo = { 'mezzo': this.mezzo, 'action': action };
        } else {
            actionMezzo = { 'mezzo': this.mezzo, 'action': null };
        }
        this.actionMezzo.emit(actionMezzo);
        // console.log('Mezzo ' + this.mezzo.descrizione + ' arrivato sul posto.');
    }
}
