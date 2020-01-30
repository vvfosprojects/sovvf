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
    @Output() removeUser: EventEmitter<{ id: string, nominativoUtente: string }> = new EventEmitter<{ id: string, nominativoUtente: string }>();
    @Output() removeRoleUser: EventEmitter<{ id: string, ruolo: Ruolo, nominativoUtente: string }> = new EventEmitter<{ id: string, ruolo: Ruolo, nominativoUtente: string }>();
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    onDetail(id: string) {
        this.detail.emit(id);
    }

    onRemoveUtente(id: string, nominativoUtente: string) {
        const obj = { id, nominativoUtente };
        this.removeUser.emit(obj);
    }

    onRemoveRuoloUtente(id: string, ruolo: Ruolo, nominativoUtente: string) {
        const obj = { id, ruolo, nominativoUtente };
        this.removeRoleUser.emit(obj);
    }
}
