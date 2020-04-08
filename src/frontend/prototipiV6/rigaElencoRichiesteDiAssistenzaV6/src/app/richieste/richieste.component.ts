import { Component, EventEmitter, Input, isDevMode, OnDestroy, OnInit, Output } from '@angular/core';
import { SintesiRichiesta } from '../shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.component.html',
    styleUrls: ['./richieste.component.css']
})
export class RichiesteComponent implements OnInit, OnDestroy {

    @Input() split: string;
    @Output() statoPartenza = new EventEmitter<string>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();

    ngOnInit(): void {
        isDevMode() && console.log('Componente Richieste creato');
    }

    ngOnDestroy() {
        isDevMode() && console.log('Componente Richieste distrutto');
    }
}
