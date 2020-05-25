import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-ricerca-utenti',
    templateUrl: './ricerca-utenti.component.html',
    styleUrls: [ './ricerca-utenti.component.css' ]
})
export class RicercaUtentiComponent {

    @Input() loading: boolean;
    @Input() sediFiltro: string[];
    ricerca: string;

    @Output() ricercaChange = new EventEmitter<any>();
}
