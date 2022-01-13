import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-risultati-alert',
    templateUrl: './risultati-alert.component.html',
    styleUrls: ['./risultati-alert.component.css']
})
export class RisultatiAlertComponent {

    @Input() items: boolean;
    @Input() filters: boolean;
    @Input() ricerca: boolean;
    @Input() loading: boolean;

    getIcona(): string {
        let icona: string;
        if (this.loading) {
            icona = 'spinner fa-spin';
        } else {
            icona = 'exclamation-triangle';
        }
        return icona;
    }

    getTesto(): string {
        let testo: string;
        if (this.loading) {
            testo = 'Caricamento risultati in corso...';
        } else {
            if (!this.ricerca && !this.filters) {
                testo = 'Spiacente, nessun elemento trovato';
            } else if (!this.ricerca && this.filters) {
                testo = 'Spiacente, nessun risultato con i filtri selezionati';
            } else if (this.ricerca && !this.filters) {
                testo = 'Spiacente, nessun risultato con i parametri di ricerca selezionati';
            } else if (this.ricerca && this.filters) {
                testo = 'Spiacente, nessun risultato con i parametri di ricerca e i filtri selezionati';
            }
        }
        return testo;
    }
}
