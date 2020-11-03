import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    templateUrl: './statistiche.component.html'
})
export class StatisticheComponent implements OnInit, OnDestroy {

    constructor() {
    }

    ngOnInit(): void {
        console.log('Componente Statistiche creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Statistiche distrutto');
    }

}
