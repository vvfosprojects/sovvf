import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RicercaService } from "./ricerca/ricerca.service";
import { RisultatoRicerca } from "./ricerca/risultato-ricerca";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app works!';
    risultati: RisultatoRicerca[];

    constructor(private _ricercaService: RicercaService) {
        this.chiamaRicercaService();
        this.logRisultati();

    }

    chiamaRicercaService() {
        var sub = this._ricercaService.ricerca('pippo').subscribe(
            risultatiRicerca => {
                this.risultati = risultatiRicerca;
                console.log('risultati in json: ' + JSON.stringify(risultatiRicerca));
            },
            error => {
                console.log('Error: ' + error);
            },
            function () {
                console.log('Completed');
            });

        sub.unsubscribe();
    }

    logRisultati() {
        for (var risultato of this.risultati) {
            console.log('testo: ' + risultato.testo);
            console.log('tooltip: ' + risultato.tooltip);
        }
    }
}
