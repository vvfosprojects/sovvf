import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColoriStatoMezzo } from '../../helper/_colori';
import { Mezzo } from '../../model/mezzo.model';
import { HelperComposizione } from '../../../features/home/composizione-partenza/shared/helper/_helper-composizione';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-mezzo',
    templateUrl: './mezzo.component.html',
    styleUrls: ['./mezzo.component.scss']
})
export class MezzoComponent implements OnInit {

    @Input() mezzo: Mezzo;
    @Output() mezzoArrivatoSulPosto: EventEmitter<any> = new EventEmitter();
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

    onArrivatoSulPosto() {
        this.mezzoArrivatoSulPosto.emit(this.mezzo);
        // console.log('Mezzo ' + this.mezzo.descrizione + ' arrivato sul posto.');
    }
}
