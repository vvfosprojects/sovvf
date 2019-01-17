import { Component, EventEmitter, isDevMode, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-chiamata',
    templateUrl: './chiamata.component.html',
    styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit, OnDestroy {

    @Output() annullaChiamata = new EventEmitter();
    @Output() chiamataMarker = new EventEmitter();

    ngOnInit(): void {
        isDevMode() && console.log('Componente Chiamata creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Chiamata distrutto');
    }

}
