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

    @Input() nightMode: boolean;
    @Input() listaUtenti: Utente[];
    @Input() page: number;
    @Input() pageSize: number;
    @Input() pageSizes: number[];
    @Input() totalItems: number;
    @Input() loading: boolean;
    @Input() idUtenteLoggato: string;

    @Output() removeUser: EventEmitter<{ codFiscale: string, nominativoUtente: string }> = new EventEmitter<{ codFiscale: string, nominativoUtente: string }>();
    @Output() removeRoleUser: EventEmitter<{ codFiscale: string, ruolo: Ruolo, nominativoUtente: string }> = new EventEmitter<{ codFiscale: string, ruolo: Ruolo, nominativoUtente: string }>();
    @Output() addRuoloUtente: EventEmitter<{ codFiscale: string, fullName: string, ruoliAttuali: Ruolo[] }> = new EventEmitter<{ codFiscale: string, fullName: string, ruoliAttuali: Ruolo[] }>();
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    onRemoveUtente(codFiscale: string, nominativoUtente: string): void {
        const obj = { codFiscale, nominativoUtente };
        this.removeUser.emit(obj);
    }

    onRemoveRuoloUtente(codFiscale: string, ruolo: Ruolo, nominativoUtente: string): void {
        const obj = { codFiscale, ruolo, nominativoUtente };
        this.removeRoleUser.emit(obj);
    }

    nightModeStyle(): string {
      let value = '';
      if (!this.nightMode) {
        value = ' ';
      } else if (this.nightMode) {
        value = 'moon-text moon-card-light';
      }
      return value;
    }

    onAddRuoloUtente(codFiscale: string, fullName: string, ruoliAttuali: Ruolo[]): void {
        const obj = { codFiscale, fullName, ruoliAttuali };
        this.addRuoloUtente.emit(obj);
    }

    wipeRoleString(text: string): string {
        return wipeStringUppercase(text);
    }
}
