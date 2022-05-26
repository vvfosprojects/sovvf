import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnteInterface } from 'src/app/shared/interface/ente.interface';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';

@Component({
    selector: 'app-tabella-rubrica',
    templateUrl: './tabella-rubrica.component.html',
    styleUrls: ['./tabella-rubrica.component.css']
})
export class TabellaRubricaComponent {

    @Input() page: number;
    @Input() pageSize: number;
    @Input() pageSizes: number[];
    @Input() totalItems: number;
    @Input() loading: boolean;
    @Input() vociRubrica: EnteInterface[];
    @Input() nightMode: boolean;

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() editVoceRubrica: EventEmitter<EnteInterface> = new EventEmitter<EnteInterface>();
    @Output() deleteVoceRubrica: EventEmitter<{ idVoceRubrica: string, descrizioneVoceRubrica: string }> = new EventEmitter<{ idVoceRubrica: string, descrizioneVoceRubrica: string }>();

    permissionFeatures = PermissionFeatures;

    constructor() {
    }

    onEditVoceRubrica(voceRubrica: EnteInterface): void {
        this.editVoceRubrica.emit(voceRubrica);
    }

    onDeleteVoceRubrica(idVoceRubrica: string, descrizioneVoceRubrica: string): void {
        this.deleteVoceRubrica.emit({ idVoceRubrica, descrizioneVoceRubrica });
    }
}
