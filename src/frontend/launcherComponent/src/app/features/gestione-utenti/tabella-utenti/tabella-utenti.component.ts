import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Utente } from '../../../shared/model/utente.model';


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
    @Output() modify: EventEmitter<string> = new EventEmitter<string>();
    @Output() remove: EventEmitter<string> = new EventEmitter<string>();
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    onDetail(id: string) {
        this.detail.emit(id);
    }

    onModify(id: string) {
        this.modify.emit(id);
    }

    onRemove(id: string) {
        this.remove.emit(id);
    }
}
