import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ruolo } from '../../../shared/model/utente.model';

@Component({
    selector: 'app-ricerca-utenti',
    templateUrl: './ricerca-utenti.component.html',
    styleUrls: ['./ricerca-utenti.component.css']
})
export class RicercaUtentiComponent {

    @Input() ricerca: string;
    @Input() loading: boolean;
    @Input() sediFiltro: Ruolo[];
    @Input() sediFiltroSelezionate: string[];

    @Output() ricercaChange = new EventEmitter<any>();
    @Output() filtroChange = new EventEmitter<string>();
    @Output() filtriReset = new EventEmitter<any>();

    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-right';
    }

    onAddFiltroSede(filtroSede: Ruolo): void {
        this.filtroChange.emit(filtroSede.codSede);
    }

    onRemoveFiltroSede(event: { value: Ruolo }): void {
        this.filtroChange.emit(event.value.codSede);
    }

    onResetFiltriSedi(): void {
        this.filtriReset.emit();
    }
}
