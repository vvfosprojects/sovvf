import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Role, Ruolo, Utente } from '../../../shared/model/utente.model';
import { getPermessiByRole, wipeStringUppercase } from '../../../shared/helper/function';


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

    @Output() detail: EventEmitter<string> = new EventEmitter<string>();
    @Output() detailPermessi: EventEmitter<Role> = new EventEmitter<Role>();
    @Output() removeUser: EventEmitter<{ id: string, nominativoUtente: string }> = new EventEmitter<{ id: string, nominativoUtente: string }>();
    @Output() removeRoleUser: EventEmitter<{ id: string, ruolo: Ruolo, nominativoUtente: string }> = new EventEmitter<{ id: string, ruolo: Ruolo, nominativoUtente: string }>();
    @Output() addRuoloUtente: EventEmitter<{ codFiscale: string, fullName: string }> = new EventEmitter<{ codFiscale: string, fullName: string }>();
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    dettaglioPermessi: string[];

    constructor() {
    }

    onDetail(id: string) {
        this.detail.emit(id);
    }

    onDetailPermessi(event: { descrizione: Role, codSede: string, descSede: string }) {
        this.dettaglioPermessi = getPermessiByRole(event.descrizione);
    }

    onRemoveUtente(id: string, nominativoUtente: string) {
        const obj = { id, nominativoUtente };
        this.removeUser.emit(obj);
    }

    onRemoveRuoloUtente(id: string, ruolo: Ruolo, nominativoUtente: string) {
        const obj = { id, ruolo, nominativoUtente };
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
