import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { defineChiamataIntervento } from '../../../../shared/helper/function-richieste';
import { InsertChiamataTest, StopLoadingSchedaRichiesta } from '../../store/actions/form-richiesta/scheda-telefonata.actions';
import { Store } from '@ngxs/store';

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

    constructor(private store: Store) {
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

    startTestInserimento(): void {
        // Parametri modificabili
        this.testInserimento.maxCount = 500;
        this.testInserimento.msInterval = 5000;
        // Fine Parametri modificabili

        this.testInserimento.active = true;
        this.testInserimento.count = 0;
        this.testInserimento.interval = setInterval(() => {
            if (this.testInserimento.count <= this.testInserimento.maxCount) {
                this.store.dispatch(new InsertChiamataTest());
                this.testInserimento.count = this.testInserimento.count + 1;
            } else {
                this.stopTestInserimento();
            }
        }, this.testInserimento.msInterval);
    }

    stopTestInserimento(): void {
        this.store.dispatch(new StopLoadingSchedaRichiesta());
        this.testInserimento.active = false;
        this.testInserimento.count = 0;
        clearInterval(this.testInserimento.interval);
    }
}
