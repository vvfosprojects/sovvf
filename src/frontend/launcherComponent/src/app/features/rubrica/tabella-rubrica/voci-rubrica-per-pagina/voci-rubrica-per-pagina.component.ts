import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-voci-rubrica-per-pagina',
    templateUrl: './voci-rubrica-per-pagina.component.html',
    styleUrls: ['./voci-rubrica-per-pagina.component.css']
})
export class VociRubricaPerPaginaComponent implements OnInit {

    @Input() pageSize: number;
    @Input() pageSizes: number[];

    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit() {
    }

    onChangePageSize(pageSize: number) {
        this.pageSizeChange.emit(pageSize);
    }
}
