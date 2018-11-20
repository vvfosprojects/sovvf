import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {SintesiRichiesta} from '../../model/sintesi-richiesta.model';
import {Mezzo} from '../../model/mezzo.model';
import {ColoriStatoMezzo} from '../../helper/_colori';

@Component({
    selector: 'app-mezzo',
    templateUrl: './mezzo.component.html',
    styleUrls: ['./mezzo.component.scss']
})
export class MezzoComponent implements OnInit {

    @Input() mezzo: Mezzo;
    stato = new ColoriStatoMezzo();

    constructor() {
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

}
