import { Component, EventEmitter, Input, isDevMode, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.component.html',
    styleUrls: ['./richieste.component.css']
})
export class RichiesteComponent implements OnInit, OnDestroy {

    @Input() split: string;
    @Output() statoPartenza = new EventEmitter<boolean>();

    ngOnInit(): void {
        isDevMode() && console.log('Componente Richieste creato');
    }

    ngOnDestroy() {
        isDevMode() && console.log('Componente Richieste distrutto');
    }
}
