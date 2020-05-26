import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-ricerca-utenti',
    templateUrl: './ricerca-utenti.component.html',
    styleUrls: ['./ricerca-utenti.component.css']
})
export class RicercaUtentiComponent {

    @Input() loading: boolean;
    @Input() sediFiltro: any[];
    @Input() sediFiltroSelezionate: string[];
    ricerca: string;

    @Output() ricercaChange = new EventEmitter<any>();
    @Output() filtroChange = new EventEmitter<string>();

    _isSelected(codSede: string) {
        return this.sediFiltroSelezionate.filter(s => s === codSede).length > 0;
    }
}
