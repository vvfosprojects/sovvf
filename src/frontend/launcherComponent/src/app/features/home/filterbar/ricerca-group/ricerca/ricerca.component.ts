import { Component, Output, EventEmitter, Input } from '@angular/core';
import { makeCopy } from '../../../../../shared/helper/function';

@Component({
    selector: 'app-ricerca',
    templateUrl: './ricerca.component.html',
    styleUrls: ['./ricerca.component.scss']
})
export class RicercaComponent {

    @Input() ricerca = '';
    @Input() disabled = false;
    @Output() search: EventEmitter<string> = new EventEmitter();

    onSearch() {
        this.search.emit(makeCopy(this.ricerca));
    }

}
