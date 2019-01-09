import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-servizi',
    templateUrl: './servizi.component.html',
    styleUrls: ['./servizi.component.css']
})
export class ServiziComponent implements OnInit, OnDestroy {

    constructor() {
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Servizi creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Servizi distrutto');
    }

}
