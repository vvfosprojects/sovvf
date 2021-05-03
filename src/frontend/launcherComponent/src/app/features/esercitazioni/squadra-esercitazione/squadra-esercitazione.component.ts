import { Component, Input, OnInit } from '@angular/core';
import { SquadraEsercitazione } from '../interface/squadra-esercitazione.interface';

@Component({
    selector: 'app-squadra-esercitazione',
    templateUrl: './squadra-esercitazione.component.html',
    styleUrls: ['./squadra-esercitazione.component.scss']
})
export class SquadraEsercitazioneComponent implements OnInit {

    @Input() squadraEsercitazione: SquadraEsercitazione;

    constructor() {
    }

    ngOnInit(): void {
    }

}
