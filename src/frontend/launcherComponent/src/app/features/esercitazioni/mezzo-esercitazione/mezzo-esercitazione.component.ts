import { Component, Input, OnInit } from '@angular/core';
import { MezzoEsercitazione } from '../interface/mezzo-esercitazione.interface';

@Component({
    selector: 'app-mezzo-esercitazione',
    templateUrl: './mezzo-esercitazione.component.html',
    styleUrls: ['./mezzo-esercitazione.component.scss']
})
export class MezzoEsercitazioneComponent implements OnInit {

    @Input() mezzoEsercitazione: MezzoEsercitazione;

    constructor() {
    }

    ngOnInit(): void {
    }

}
