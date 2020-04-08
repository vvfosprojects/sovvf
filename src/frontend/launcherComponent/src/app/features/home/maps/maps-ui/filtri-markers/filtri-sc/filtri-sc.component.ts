import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-filtri-sc',
    templateUrl: './filtri-sc.component.html',
    styleUrls: [ './filtri-sc.component.css' ]
})
export class FiltriScComponent {

    @Input() statoFiltro = false;
    @Output() toggleSC = new EventEmitter();

}
