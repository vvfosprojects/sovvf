import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VoceRubrica } from 'src/app/shared/interface/rubrica.interface';

@Component({
    selector: 'app-tabella-rubrica',
    templateUrl: './tabella-rubrica.component.html',
    styleUrls: ['./tabella-rubrica.component.css']
})
export class TabellaRubricaComponent implements OnInit {

    @Input() page: number;
    @Input() pageSize: number;
    @Input() pageSizes: number[];
    @Input() totalItems: number;
    @Input() loading: boolean;
    @Input() vociRubrica: VoceRubrica[];

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

    ngOnInit() {
    }

}
