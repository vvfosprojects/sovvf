import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    templateUrl: './servizi.component.html'
})
export class ServiziComponent implements OnInit, OnDestroy {

    constructor() {
    }

    ngOnInit(): void {
        console.log('Componente Servizi creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Servizi distrutto');
    }

}
