import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PosInterface } from '../../../shared/interface/pos.interface';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { DettaglioTipologia } from '../../../shared/interface/dettaglio-tipologia.interface';
import { getDettagliTipologieFromListaTipologie, getTipologieFromListaTipologie } from 'src/app/shared/helper/function-pos';
import { TipoConcorrenzaEnum } from '../../../shared/enum/tipo-concorrenza.enum';
import { LockedConcorrenzaService } from '../../../core/service/concorrenza-service/locked-concorrenza.service';

@Component({
    selector: 'app-tabella-pos',
    templateUrl: './tabella-pos.component.html',
    styleUrls: ['./tabella-pos.component.css']
})
export class TabellaPosComponent {

    @Input() page: number;
    @Input() pageSize: number;
    @Input() pageSizes: number[];
    @Input() totalItems: number;
    @Input() loading: boolean;
    @Input() pos: PosInterface[];
    @Input() tipologie: Tipologia[];
    @Input() dettagliTipologie: DettaglioTipologia[];

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() view: EventEmitter<PosInterface> = new EventEmitter<PosInterface>();
    @Output() download: EventEmitter<PosInterface> = new EventEmitter<PosInterface>();
    @Output() editPos: EventEmitter<PosInterface> = new EventEmitter<PosInterface>();
    @Output() deletePos: EventEmitter<{ idPos: string, descrizionePos: string }> = new EventEmitter<{ idPos: string, descrizionePos: string }>();

    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    constructor(private lockedConcorrenzaService: LockedConcorrenzaService) {
    }

    onViewPos(pos: PosInterface): void {
        this.view.emit(pos);
    }

    onDownloadPos(pos: PosInterface): void {
        this.download.emit(pos);
    }

    onEditPos(pos: PosInterface): void {
        this.editPos.emit(pos);
    }

    onDeletePos(idPos: string, descrizionePos: string): void {
        this.deletePos.emit({ idPos, descrizionePos });
    }

    getTipologieFromListaTipologie(pos: PosInterface, tipologie: Tipologia[]): Tipologia[] {
        return getTipologieFromListaTipologie(pos, tipologie);
    }

    getDettagliTipologieFromListaTipologie(pos: PosInterface, dettagliTipologie: DettaglioTipologia[]): DettaglioTipologia[] {
        return getDettagliTipologieFromListaTipologie(pos, dettagliTipologie);
    }

    getTooltipConcorrenzaText(idPos: string): string {
        const modificaPosLocked = this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.ModificaPos, [idPos]);
        const eliminaPosLocked = this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.EliminaPos, [idPos]);
        const allLocked = modificaPosLocked && eliminaPosLocked;
        if (allLocked) {
            return modificaPosLocked;
        } else if (modificaPosLocked) {
            return modificaPosLocked;
        } else if (eliminaPosLocked) {
            return eliminaPosLocked;
        }
    }

}
