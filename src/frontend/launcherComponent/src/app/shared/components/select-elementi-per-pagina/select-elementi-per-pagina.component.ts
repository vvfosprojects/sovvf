import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-select-elementi-per-pagina',
    templateUrl: './select-elementi-per-pagina.component.html',
    styleUrls: ['./select-elementi-per-pagina.component.css']
})
export class SelectElementiPerPaginaComponent {

    @Input() pageSize: number;
    @Input() pageSizes: number[];
    @Input() placeholderElementi = 'elementi';

    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    onChangePageSize(pageSize: number) {
        this.pageSizeChange.emit(pageSize);
    }
}
