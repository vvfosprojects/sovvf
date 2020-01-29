import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Ruolo, Utente } from '../../../shared/model/utente.model';


@Component({
    selector: 'app-tabella-utenti',
    templateUrl: './tabella-utenti.component.html',
    providers: [DecimalPipe]
})
export class TabellaUtentiComponent {

    @Input() ruoli: Array<any>;
    @Input() listaUtenti: Utente[];
    @Input() page: number;
    @Input() pageSize: number;
    @Input() totalItems: number;
    @Input() loading: boolean;

    @Output() detail: EventEmitter<string> = new EventEmitter<string>();
    @Output() removeUser: EventEmitter<string> = new EventEmitter<string>();
    @Output() removeRoleUser: EventEmitter<{id: string, ruolo: Ruolo}> = new EventEmitter<{id: string, ruolo: Ruolo}>();
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    onDetail(id: string) {
        this.detail.emit(id);
    }

    onRemoveUtente(id: string) {
        this.removeUser.emit(id);
    }

    onRemoveRuoloUtente(id: string, ruolo: Ruolo) {
        const obj = {id, ruolo};
        this.removeRoleUser.emit(obj);
    }
}
