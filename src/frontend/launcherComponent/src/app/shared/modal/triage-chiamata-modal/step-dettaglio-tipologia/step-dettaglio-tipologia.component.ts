import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DettaglioTipologia } from '../../../interface/dettaglio-tipologia.interface';

@Component({
    selector: 'app-step-dettaglio-tipologia',
    templateUrl: './step-dettaglio-tipologia.component.html',
    styleUrls: ['./step-dettaglio-tipologia.component.scss']
})
export class StepDettaglioTipologiaComponent {

    @Input() dettagliTipologie: DettaglioTipologia[];

    @Output() changeDettaglioTipologia: EventEmitter<number> = new EventEmitter<number>();

    codDettaglioTipologiaSelezionato: number;

    constructor() {
    }

    onCheckDettaglioTipologia(codice: number): void {
        if (codice) {
            this.codDettaglioTipologiaSelezionato = codice;
            this.changeDettaglioTipologia.emit(codice);
        } else {

            this.codDettaglioTipologiaSelezionato = null;
            this.changeDettaglioTipologia.emit(null);
        }
    }

    getStatus(dettaglioTipologia: DettaglioTipologia): boolean {
        return dettaglioTipologia.codiceDettaglioTipologia === this.codDettaglioTipologiaSelezionato;
    }

}
