import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-step-dettaglio-tipologia',
    templateUrl: './step-dettaglio-tipologia.component.html',
    styleUrls: ['./step-dettaglio-tipologia.component.scss']
})
export class StepDettaglioTipologiaComponent implements OnInit {

    @Input() dettagliTipologie: any[];

    @Output() changeDettaglioTipologia: EventEmitter<string> = new EventEmitter<string>();

    codDettaglioTipologiaSelezionato: string;

    constructor() {
    }

    ngOnInit(): void {
    }

    onCheckDettaglioTipologia(codice: string): void {
        if (codice) {
            this.codDettaglioTipologiaSelezionato = codice;
            this.changeDettaglioTipologia.emit(codice);
        } else {

            this.codDettaglioTipologiaSelezionato = null;
            this.changeDettaglioTipologia.emit(null);
        }
    }

}
