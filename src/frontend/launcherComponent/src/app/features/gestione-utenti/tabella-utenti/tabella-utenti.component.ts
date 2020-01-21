import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { GestioneUtente } from '../../../shared/interface/gestione-utente.interface';


@Component({
    selector: 'app-tabella-utenti',
    templateUrl: './tabella-utenti.component.html',
    providers: [DecimalPipe]
})
export class TabellaUtentiComponent {

    @Input() ruoli: Array<any>;
    @Input() listaUtenti: GestioneUtente[];
    @Input() page: number;
    @Input() pageSize: number;
    @Input() totalItems: number;
    @Input() loading: boolean;

    @Output() update: EventEmitter<any> = new EventEmitter<any>();
    @Output() remove: EventEmitter<any> = new EventEmitter<any>();
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    onUpdate(utente: GestioneUtente) {
        this.update.emit(utente);
    }

    onRemove(id: string) {
        this.remove.emit(id);
    }
}
