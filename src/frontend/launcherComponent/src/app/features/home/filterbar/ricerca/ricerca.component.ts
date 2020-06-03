import { Component, Output, EventEmitter, Input } from '@angular/core';
import { makeCopy } from '../../../../shared/helper/function';

@Component({
    selector: 'app-ricerca',
    templateUrl: './ricerca.component.html',
    styleUrls: ['./ricerca.component.scss']
})
export class RicercaComponent {

    @Input() placeholder: string;
    @Input() ricerca: string;
    @Input() disabled: boolean;
    @Input() debounce: boolean;

    @Output() search: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    onSearch() {
        this.search.emit(makeCopy(this.ricerca));
    }

}
