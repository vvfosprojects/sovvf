import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { defineChiamataIntervento } from '../../../../shared/helper/function-richieste';

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

    testInserimento = {
        active: false,
        interval: null,
        maxCount: 0,
        msInterval: 0,
        count: 0
    };

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

    defineChiamataIntervento(): string {
        const definizione = defineChiamataIntervento(this.richiestaModifica?.codice, this.richiestaModifica?.codiceRichiesta);
        switch (definizione) {
            case 'Chiamata':
                return `la ${definizione}`;
            case 'Intervento':
                return `l'${definizione}`;
            default:
                return 'la richiesta';
        }
    }
}
