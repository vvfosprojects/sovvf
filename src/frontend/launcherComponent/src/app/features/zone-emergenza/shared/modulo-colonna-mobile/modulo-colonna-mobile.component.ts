import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModuloColonnaMobile } from '../../interface/modulo-colonna-mobile.interface';

@Component({
    selector: 'app-modulo-colonna-mobile',
    templateUrl: './modulo-colonna-mobile.component.html',
    styleUrls: ['./modulo-colonna-mobile.component.css']
})
export class ModuloColonnaMobileComponent {

    @Input() modulo: ModuloColonnaMobile;
    @Input() selezionato: boolean;

    @Output() selezione: EventEmitter<ModuloColonnaMobile> = new EventEmitter<ModuloColonnaMobile>();

    constructor() {
    }

    onSelezione(modulo: ModuloColonnaMobile): void {
        this.selezione.emit(modulo);
    }
}
