import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {SintesiRichiesta} from '../../model/sintesi-richiesta.model';

import {Mezzo} from '../../model/mezzo.model';

@Component({
    selector: 'app-mezzo',
    templateUrl: './mezzo.component.html',
    styleUrls: ['./mezzo.component.scss']
})
export class MezzoComponent implements OnInit {

    @Input() richiesta: SintesiRichiesta;
    @Input() mezzo: Mezzo;
    @Output() LocalizzazioneMezzo: EventEmitter<SintesiRichiesta> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    nessunIndMezzo(mezzo) {
        if (
            !mezzo.descrizioneStatoEfficienza &&
            !mezzo.descrizioneLivelloCarburante &&
            !mezzo.descrizioneLivelloEstinguente &&
            !mezzo.descrizioneAppartenenzaMezzo
        ) {
            return true;
        }
    }
}
