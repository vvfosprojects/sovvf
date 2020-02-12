import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-utenti-per-pagina',
    templateUrl: './utenti-per-pagina.component.html',
    styleUrls: ['./utenti-per-pagina.component.css']
})
export class UtentiPerPaginaComponent implements OnInit {

    @Input() pageSize: number;
    @Input() pageSizes: number[];

    @Output() changePageSize: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit() {
    }

    onChangePageSize(pageSize: number) {
        this.changePageSize.emit(pageSize);
    }
}
