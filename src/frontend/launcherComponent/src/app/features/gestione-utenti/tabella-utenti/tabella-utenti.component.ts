import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Ruolo, Utente } from '../../../shared/model/utente.model';
import { wipeStringUppercase } from '../../../shared/helper/function-generiche';
import { TipoConcorrenzaEnum } from '../../../shared/enum/tipo-concorrenza.enum';
import { LockedConcorrenzaService } from '../../../core/service/concorrenza-service/locked-concorrenza.service';
import { getProvinciaByCodProvincia } from 'src/app/shared/helper/function-province';

@Component({
    selector: 'app-tabella-utenti',
    templateUrl: './tabella-utenti.component.html',
    providers: [DecimalPipe]
})
export class TabellaUtentiComponent {

    @Input() listaUtenti: Utente[];
    @Input() page: number;
    @Input() totalItems: number;
    @Input() loading: boolean;
    @Input() idUtenteLoggato: string;

    @Output() removeUser: EventEmitter<{ codFiscale: string, nominativoUtente: string }> = new EventEmitter<{ codFiscale: string, nominativoUtente: string }>();
    @Output() removeRoleUser: EventEmitter<{ codFiscale: string, ruolo: Ruolo, nominativoUtente: string }> = new EventEmitter<{ codFiscale: string, ruolo: Ruolo, nominativoUtente: string }>();
    @Output() addRuoloUtente: EventEmitter<{ codFiscale: string, fullName: string, ruoliAttuali: Ruolo[] }> = new EventEmitter<{ codFiscale: string, fullName: string, ruoliAttuali: Ruolo[] }>();
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    constructor(private lockedConcorrenzaService: LockedConcorrenzaService) {
    }

    onRemoveUtente(codFiscale: string, nominativoUtente: string): void {
        const obj = { codFiscale, nominativoUtente };
        this.removeUser.emit(obj);
    }

    onRemoveRuoloUtente(codFiscale: string, ruolo: Ruolo, nominativoUtente: string): void {
        const obj = { codFiscale, ruolo, nominativoUtente };
        this.removeRoleUser.emit(obj);
    }

    onAddRuoloUtente(codFiscale: string, fullName: string, ruoliAttuali: Ruolo[]): void {
        const obj = { codFiscale, fullName, ruoliAttuali };
        this.addRuoloUtente.emit(obj);
    }

    wipeRoleString(text: string): string {
        return wipeStringUppercase(text);
    }

    getDescSedeRuolo(descSedeRuolo: string, codSedeRuolo: string): string {
        return descSedeRuolo.toLowerCase() === 'centrale' ? descSedeRuolo + ' ' + getProvinciaByCodProvincia(codSedeRuolo.split('.')[0]).toUpperCase() : descSedeRuolo;
    }

    getTooltipConcorrenzaText(utente: Utente): string {
        const eliminaUtenteLocked = this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.EliminaUtente, [utente.codiceFiscale]);
        const aggiungiRuoloUtenteLocked = this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.AggiungiRuoloUtente, [utente.codiceFiscale]);
        const modificaRuoloUtenteLocked = this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.ModificaRuoloUtente, [utente.codiceFiscale]);
        const eliminaRuoloUtenteLocked = this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.EliminaRuoloUtente, [utente.codiceFiscale]);
        const allLocked = eliminaUtenteLocked && aggiungiRuoloUtenteLocked && modificaRuoloUtenteLocked && eliminaRuoloUtenteLocked;
        if (allLocked) {
            return eliminaUtenteLocked;
        } else if (eliminaUtenteLocked) {
            return eliminaUtenteLocked;
        } else if (aggiungiRuoloUtenteLocked) {
            return aggiungiRuoloUtenteLocked;
        } else if (modificaRuoloUtenteLocked) {
            return modificaRuoloUtenteLocked;
        } else if (eliminaRuoloUtenteLocked) {
            return eliminaRuoloUtenteLocked;
        }
    }
}
