import { Component, OnInit, Input } from '@angular/core';
import { ColoriStatoMezzo } from '../../helper/_colori';
import { Mezzo } from '../../model/mezzo.model';
import { HelperComposizione } from '../../../features/home/composizione-partenza/shared/helper/_helper-composizione';

@Component({
    selector: 'app-mezzo',
    templateUrl: './mezzo.component.html',
    styleUrls: ['./mezzo.component.scss']
})
export class MezzoComponent implements OnInit {

    @Input() mezzo: Mezzo;
    stato = new ColoriStatoMezzo();
    methods = new HelperComposizione();

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

    arrivatoSulPosto() {
        console.log('Mezzo ' + this.mezzo.descrizione + ' arrivato sul posto.');
    }
}
