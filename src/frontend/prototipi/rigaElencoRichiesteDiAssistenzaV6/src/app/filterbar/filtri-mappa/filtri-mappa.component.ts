import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-filtri-mappa',
    templateUrl: './filtri-mappa.component.html',
    styleUrls: ['./filtri-mappa.component.css']
})
export class FiltriMappaComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    richieste() {
        console.log('richieste');
    }

    mezzi() {
        console.log('mezzi');
    }

    sedi() {
        console.log('sedi');
    }

}
