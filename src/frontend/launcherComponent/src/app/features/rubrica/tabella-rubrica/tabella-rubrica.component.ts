import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ente } from 'src/app/shared/interface/ente.interface';

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
    @Input() vociRubrica: Ente[];

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() editVoceRubrica: EventEmitter<Ente> = new EventEmitter<Ente>();
    @Output() deleteVoceRubrica: EventEmitter<{ idVoceRubrica: string, descrizioneVoceRubrica: string }> = new EventEmitter<{ idVoceRubrica: string, descrizioneVoceRubrica: string }>();

    constructor() {
    }

    ngOnInit() {
    }

    onEditVoceRubrica(voceRubrica: Ente) {
        this.editVoceRubrica.emit(voceRubrica);
    }

    onDeleteVoceRubrica(idVoceRubrica: string, descrizioneVoceRubrica: string) {
        this.deleteVoceRubrica.emit({ idVoceRubrica, descrizioneVoceRubrica });
    }
}
