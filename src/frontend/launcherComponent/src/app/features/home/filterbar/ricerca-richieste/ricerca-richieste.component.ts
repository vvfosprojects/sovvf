import { Component, Output, EventEmitter, Input } from '@angular/core';
import { makeCopy } from '../../../../shared/helper/function';

@Component({
    selector: 'app-ricerca-richieste',
    templateUrl: './ricerca-richieste.component.html',
    styleUrls: ['./ricerca-richieste.component.scss']
})
export class RicercaRichiesteComponent {

    @Input() ricerca = { descrizione: '' };

    // Events
    @Output() search: EventEmitter<any> = new EventEmitter();


    constructor() {
    }

    onSearch() {
        this.search.emit(makeCopy(this.ricerca));
    }

}
