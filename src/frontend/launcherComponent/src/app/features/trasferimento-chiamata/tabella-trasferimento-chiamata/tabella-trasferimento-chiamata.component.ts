import { Component, EventEmitter, Output, Input, ChangeDetectionStrategy } from '@angular/core';
import { TrasferimentoChiamata } from 'src/app/shared/interface/trasferimento-chiamata.interface';

@Component({
    selector: 'app-tabella-trasferimento-chiamata',
    templateUrl: './tabella-trasferimento-chiamata.component.html',
    styleUrls: ['./tabella-trasferimento-chiamata.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabellaTrasferimentoChiamataComponent {

    @Input() page: number;
    @Input() pageSize: number;
    @Input() pageSizes: number[];
    @Input() totalItems: number;
    @Input() loading: boolean;
    @Input() listaTrasferimentiChiamate: TrasferimentoChiamata[];
    @Input() nightMode: boolean;

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }
}
