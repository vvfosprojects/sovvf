import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { makeCopy } from '../../../../shared/helper/function-generiche';

@Component({
    selector: 'app-ricerca',
    templateUrl: './ricerca.component.html',
    styleUrls: ['./ricerca.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RicercaComponent {

    @Input() placeholder: string;
    @Input() ricerca: string;
    @Input() disabled: boolean;
    @Input() debounce: boolean;
    @Input() disableSearch: boolean;

    @Output() search: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    onSearch(): void {
        this.search.emit(makeCopy(this.ricerca));
    }

}
