import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SchedaTelefonataInterface} from '../../home/chiamata/model/scheda-telefonata.interface';

@Component({
    selector: 'app-ricerca-utenti',
    templateUrl: './ricerca-utenti.component.html',
    styleUrls: ['./ricerca-utenti.component.css']
})
export class RicercaUtentiComponent implements OnInit {
    ricercaUtenti = {cognome: ''};

    @Output() ricerca = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit() {
    }

    onRicercaUtenti() {
        this.ricerca.emit(this.ricercaUtenti);
    }
}
