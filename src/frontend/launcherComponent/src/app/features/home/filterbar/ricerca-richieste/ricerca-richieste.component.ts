import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'app-ricerca-richieste',
    templateUrl: './ricerca-richieste.component.html',
    styleUrls: ['./ricerca-richieste.component.scss']
})
export class RicercaRichiesteComponent {
    ricerca = { descrizione: '' };

    // Events
    @Output() search: EventEmitter<any> = new EventEmitter();


    constructor() {
    }

    onSearch() {
        this.search.emit(copyObj(this.ricerca));

        function copyObj(obj: any) {
            return JSON.parse(JSON.stringify(obj));
        }
    }

}
