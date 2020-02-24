import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Ruolo, Utente } from '../../../shared/model/utente.model';
import { wipeStringUppercase } from '../../../shared/helper/function';


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
    @Input() pageSizes: number[];
    @Input() totalItems: number;
    @Input() loading: boolean;

    @Output() removeUser: EventEmitter<{ codFiscale: string, nominativoUtente: string }> = new EventEmitter<{ codFiscale: string, nominativoUtente: string }>();
    @Output() removeRoleUser: EventEmitter<{ codFiscale: string, ruolo: Ruolo, nominativoUtente: string }> = new EventEmitter<{ codFiscale: string, ruolo: Ruolo, nominativoUtente: string }>();
    @Output() addRuoloUtente: EventEmitter<{ codFiscale: string, fullName: string }> = new EventEmitter<{ codFiscale: string, fullName: string }>();
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    dettaglioPermessi: string[];

    constructor() {
    }

    onRemoveUtente(codFiscale: string, nominativoUtente: string) {
        const obj = { codFiscale, nominativoUtente };
        this.removeUser.emit(obj);
    }

    onRemoveRuoloUtente(codFiscale: string, ruolo: Ruolo, nominativoUtente: string) {
        const obj = { codFiscale, ruolo, nominativoUtente };
        this.removeRoleUser.emit(obj);
    }

    onAddRuoloUtente(codFiscale: string, fullName: string) {
        const obj = { codFiscale: codFiscale, fullName: fullName };
        this.addRuoloUtente.emit(obj);
    }

    wipeRoleString(text: string) {
        return wipeStringUppercase(text);
    }
}
