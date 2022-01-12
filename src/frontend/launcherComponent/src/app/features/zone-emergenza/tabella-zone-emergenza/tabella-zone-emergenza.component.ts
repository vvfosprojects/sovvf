import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { EventoEmergenza, ZonaEmergenza } from '../model/zona-emergenza.model';

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
    @Output() sedi: EventEmitter<ZonaEmergenza> = new EventEmitter<ZonaEmergenza>();

    constructor() {
    }

    getEventiRichiestaCreazioneCraZonaEmergenza(zonaEmergenza: ZonaEmergenza): EventoEmergenza {
        return zonaEmergenza?.listaEventi.filter((e: EventoEmergenza) => e.tipoEvento === 'RichiestaCreazioneCRA' && !e.gestita)[0];
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

    onSedi(zonaEmergenza: ZonaEmergenza): void {
        this.sedi.emit(zonaEmergenza);
    }
}
