import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';

@Component({ templateUrl: './statistiche.component.html' })
export class StatisticheComponent implements OnInit, OnDestroy {

    constructor() {
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Statistiche creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Statistiche distrutto');
    }

}
