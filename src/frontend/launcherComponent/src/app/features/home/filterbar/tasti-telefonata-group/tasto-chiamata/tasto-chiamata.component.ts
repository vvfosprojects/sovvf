import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-tasto-chiamata',
    templateUrl: './tasto-chiamata.component.html',
    styleUrls: ['./tasto-chiamata.component.css']
})
export class TastoChiamataComponent {

    @HostBinding('class') classes = 'btn-group';

    @Input() colorButtonChiamata = 'btn-outline-success';
    @Input() richiestaModifica: SintesiRichiesta;
    @Input() disabled: boolean;
    @Output() startChiamata = new EventEmitter();

    defaultColorButtonChiamata: string;

    constructor() {
        this.defaultColorButtonChiamata = this.colorButtonChiamata;
    }

    chiamata(): void {
        const bool = this.colorButtonChiamata === 'btn-outline-success';
        if (bool) {
            this.startChiamata.emit();
        }
    }

    getClasses(): string {
        let returnClass = !this.richiestaModifica ? this.colorButtonChiamata : 'btn-success';
        if (this.disabled) {
            returnClass += ' cursor-not-allowed';
        }
        return returnClass;
    }

    getActive(): boolean {
        return this.colorButtonChiamata !== this.defaultColorButtonChiamata;
    }

    getTitle(): string {
        if (!this.richiestaModifica) {
            if (!this.getActive()) {
                return 'nuova chiamata';
            } else if (this.getActive()) {
                return 'stai inserendo una nuova chiamata';
            }
        } else if (this.richiestaModifica) {
            const codRichiesta = this.richiestaModifica.codiceRichiesta ? this.richiestaModifica.codiceRichiesta : this.richiestaModifica.codice;
            return 'Stai modificando la richiesta ' + codRichiesta + ' registrata da ' + this.richiestaModifica.operatore.nome + ' ' + this.richiestaModifica.operatore.cognome + ' alle ' + this.richiestaModifica.istanteRicezioneRichiesta.toLocaleString();
        }
    }
}
