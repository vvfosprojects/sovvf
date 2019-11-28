import { Component, Output, EventEmitter, Input, HostBinding } from '@angular/core';
import { makeCopy } from '../../../../../shared/helper/function';

@Component({
    selector: 'app-ricerca',
    templateUrl: './ricerca.component.html',
    styleUrls: ['./ricerca.component.scss']
})
export class RicercaComponent {

    @HostBinding('class') classes = 'input-group';

    @Input() ricerca = '';

    // Events
    @Output() search: EventEmitter<string> = new EventEmitter();


    constructor() {
    }

    onSearch() {
        this.search.emit(makeCopy(this.ricerca));
    }

}
