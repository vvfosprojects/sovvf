import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ruolo } from '../../../shared/model/utente.model';
import { CheckboxInterface } from '../../../shared/interface/checkbox.interface';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

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


    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
    }

    _isSelected(codSede: string): boolean {
        return this.sediFiltroSelezionate.filter(s => s === codSede).length > 0;
    }
}
