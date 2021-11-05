import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ZonaEmergenza } from '../../../shared/model/zona-emergenza.model';

@Component({
    selector: 'app-tabella-zone-emergenza',
    templateUrl: './tabella-zone-emergenza.component.html',
    styleUrls: ['./tabella-zone-emergenza.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabellaZoneEmergenzaComponent {

    @Input() page: number;
    @Input() pageSize: number;
    @Input() totalItems: number;
    @Input() loading: boolean;
    @Input() zoneEmergenza: ZonaEmergenza[];
    @Input() nightMode: boolean;

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() edit: EventEmitter<ZonaEmergenza> = new EventEmitter<ZonaEmergenza>();
    @Output() delete: EventEmitter<ZonaEmergenza> = new EventEmitter<ZonaEmergenza>();

    constructor() {
    }

    onEdit(pos: ZonaEmergenza): void {
        this.edit.emit(pos);
    }

    onDelete(zonaEmergenza: ZonaEmergenza): void {
        this.delete.emit(zonaEmergenza);
    }
}