import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {SintesiRichiesta} from '../model/sintesi-richiesta.model';

import {Mezzo} from '../model/mezzo.model';

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

    private localizzazioneMezzo(mezzo: Mezzo): void {
        console.log(mezzo.codice);
        // console.log("Sono il componente. Voglio localizzare il mezzo", this.richiesta.mezzi[id].descrizione);
        // this.LocalizzazioneMezzo.emit(this.richiesta);
    }
}
