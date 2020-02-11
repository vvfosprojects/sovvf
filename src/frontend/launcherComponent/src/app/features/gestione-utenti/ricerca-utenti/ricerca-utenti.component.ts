import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-ricerca-utenti',
    templateUrl: './ricerca-utenti.component.html',
    styleUrls: ['./ricerca-utenti.component.css']
})
export class RicercaUtentiComponent {
    ricerca: string;
    @Output() ricercaChange = new EventEmitter<any>();
}
