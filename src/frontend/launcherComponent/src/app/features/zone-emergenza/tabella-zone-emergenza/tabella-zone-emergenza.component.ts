import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ZonaEmergenza } from '../model/zona-emergenza.model';

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
    @Input() isDirRegionale: boolean;
    @Input() isCON: boolean;

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() detail: EventEmitter<ZonaEmergenza> = new EventEmitter<ZonaEmergenza>();
    @Output() edit: EventEmitter<ZonaEmergenza> = new EventEmitter<ZonaEmergenza>();
    @Output() delete: EventEmitter<ZonaEmergenza> = new EventEmitter<ZonaEmergenza>();
    @Output() colonneMobili: EventEmitter<{ zonaEmergenza: ZonaEmergenza, fase: string }> = new EventEmitter<{ zonaEmergenza: ZonaEmergenza, fase: string }>();
    @Output() allertaCON: EventEmitter<ZonaEmergenza> = new EventEmitter<ZonaEmergenza>();

    constructor() {
    }

    onDetail(zonaEmergenza: ZonaEmergenza): void {
        this.detail.emit(zonaEmergenza);
    }

    onEdit(zonaEmergenza: ZonaEmergenza): void {
        this.edit.emit(zonaEmergenza);
    }

    onDelete(zonaEmergenza: ZonaEmergenza): void {
        this.delete.emit(zonaEmergenza);
    }

    onColonneMobili(zonaEmergenza: ZonaEmergenza, fase: string): void {
        this.colonneMobili.emit({ zonaEmergenza, fase });
    }

    onAllertaCON(zonaEmergenza: ZonaEmergenza): void {
        this.allertaCON.emit(zonaEmergenza);
    }
}
