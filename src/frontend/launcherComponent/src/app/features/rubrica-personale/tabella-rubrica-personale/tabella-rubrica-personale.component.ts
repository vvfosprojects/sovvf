import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RubricaPersonale } from '../../../shared/interface/rubrica-personale.interface';

@Component({
    selector: 'app-tabella-rubrica-personale',
    templateUrl: './tabella-rubrica-personale.component.html',
    styleUrls: ['./tabella-rubrica-personale.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabellaRubricaPersonaleComponent {

    @Input() page: number;
    @Input() pageSize: number;
    @Input() pageSizes: number[];
    @Input() totalItems: number;
    @Input() loading: boolean;
    @Input() vociRubricaPersonale: RubricaPersonale[];

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {
    }

}
