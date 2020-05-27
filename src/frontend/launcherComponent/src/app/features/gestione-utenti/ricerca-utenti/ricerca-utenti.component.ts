import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ruolo } from '../../../shared/model/utente.model';

@Component({
    selector: 'app-ricerca-utenti',
    templateUrl: './ricerca-utenti.component.html',
    styleUrls: ['./ricerca-utenti.component.css']
})
export class RicercaUtentiComponent {

    @Input() loading: boolean;
    @Input() sediFiltro: Ruolo[];
    @Input() sediFiltroSelezionate: string[];
    ricerca: string;

    @Output() ricercaChange = new EventEmitter<any>();
    @Output() filtroChange = new EventEmitter<string>();


    getCheckboxState(f: any) {
        return { id: f.codSede, status: this._isSelected(f), label: f.descSede };
    }

    _isSelected(codSede: string) {
        return this.sediFiltroSelezionate.filter(s => s === codSede).length > 0;
    }
}
