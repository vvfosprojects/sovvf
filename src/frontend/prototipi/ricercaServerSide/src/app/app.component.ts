import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RicercaService } from "./ricerca/ricerca.service";
import { RisultatoRicerca } from "./ricerca/risultato-ricerca";
import { CompleterCmp, CompleterData, CompleterService, CompleterItem, RemoteData } from 'ng2-completer';

import { AutoCompleteModule } from 'primeng/primeng';

declare var require: any
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app works!';
    risultati: RisultatoRicerca[];
    risultatiMultipli: RisultatoRicerca[];
    voce: RisultatoRicerca = new RisultatoRicerca("id0", "risultato iniziale", "tooltip");

    text: string;
    results: string[];

    filteredCountriesSingle: any[];

    protected searchStr: string;
    public countries = require("data/countries.json");
    protected captain: string;
    protected dataService: CompleterData;
    private dataService2: CompleterData;
    private dataRemote: CompleterData;
    private dataRemote2: RemoteData;
    protected searchData = [
        { color: 'red', value: '#f00' },
        { color: 'green', value: '#0f0' },
        { color: 'blue', value: '#00f' },
        { color: 'cyan', value: '#0ff' },
        { color: 'magenta', value: '#f0f' },
        { color: 'yellow', value: '#ff0' },
        { color: 'black', value: '#000' }
    ];


    protected datigg: string[];
    protected captains = ['James T. Kirk', 'Benjamin Sisko', 'Jean-Luc Picard', 'Spock', 'Jonathan Archer', 'Hikaru Sulu', 'Christopher Pike', 'Rachel Garrett'];
    //protected captains = ;
    private countryName2 = "";

    constructor(private _ricercaService: RicercaService, private completerService: CompleterService) {
        this.chiamaRicercaService();
        //  this.logRisultati();
        // dati locali
        this.dataService = completerService.local(this.searchData, 'color', 'color');

        // dati locali con immagini
        this.dataService2 = completerService.local(this.countries, "name", "name").imageField("flag");

        //dati remoti
        this.dataRemote = completerService.remote(
            "https://raw.githubusercontent.com/oferh/ng2-completer/master/demo/res/data/countries.json?",
            "name",
            "name");

        this.dataRemote2 = completerService.remote(
            null,
            null,
            "Title");

        this.dataRemote2.urlFormater(term => {
            return `http://www.omdbapi.com/?s=${term}&type=movie`;
        });
        this.dataRemote2.dataField("Search");


    }

    searchFake(event) {
        this._ricercaService.ricerca(event.query)
            .subscribe(data => {
                this.risultati = data;
            });
    }

    filterCountrySingle(event) {
        let query = event.query;
        this._ricercaService.getCountries().subscribe(countries => {
            this.filteredCountriesSingle = this.filterCountry(query, countries);
        });
    }

    filterCountry(query, countries: any[]): any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        for (let i = 0; i < countries.length; i++) {
            let country = countries[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        return filtered;
    }


    public onCountrySelected(selected: CompleterItem) {
        if (selected) {
            this.countryName2 = selected.title;
        } else {
            this.countryName2 = "";
        }
    }

    chiamaRicercaService() {
        var sub = this._ricercaService.ricerca(this.captain).subscribe(
            risultatiRicerca => {
                this.risultati = risultatiRicerca;
                console.log("Aggiorno array...");
                this.aggiornaArray();
                console.log("Aggiornato!");
                // console.log('risultati in json: ' + JSON.stringify(risultatiRicerca));
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
            this.captains.push(risultato.testo);
            console.log('testo: ' + risultato.testo);
            console.log('tooltip: ' + risultato.tooltip);
        }

    }
    aggiornaArray() {
        for (var risultato of this.risultati) {
            console.log('inserisco: ' + risultato.testo);
            this.captains.push(risultato.testo);
            console.log('inserito : ' + risultato.testo + " lunghezza =" + this.captains.length);
        }
    }
}
