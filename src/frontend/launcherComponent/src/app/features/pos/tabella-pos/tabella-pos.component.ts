import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PosInterface, TipologiaPos } from '../../../shared/interface/pos.interface';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { DettaglioTipologia } from '../../../shared/interface/dettaglio-tipologia.interface';

@Component({
    selector: 'app-tabella-pos',
    templateUrl: './tabella-pos.component.html',
    styleUrls: ['./tabella-pos.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    @Output() download: EventEmitter<PosInterface> = new EventEmitter<PosInterface>();
    @Output() editPos: EventEmitter<PosInterface> = new EventEmitter<PosInterface>();
    @Output() deletePos: EventEmitter<{ idPos: string, descrizionePos: string }> = new EventEmitter<{ idPos: string, descrizionePos: string }>();

    constructor() {
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

    getTipologieFromListaTipologie(pos: PosInterface): Tipologia[] {
        const tipologie = [];
        pos?.listaTipologie?.forEach((tipologiaPos: TipologiaPos) => {
            const tipologiaTrovata = tipologie?.filter((t: Tipologia) => t?.codice === '' + tipologiaPos?.codTipologia)[0];
            if (!tipologiaTrovata) {
                const tipologia = this.tipologie?.filter((t: Tipologia) => t?.codice === '' + tipologiaPos?.codTipologia)[0];
                tipologie.push(tipologia);
            }
        });
        return tipologie;
    }

    getDettagliTipologieFromListaTipologie(pos: PosInterface): DettaglioTipologia[] {
        const dettagliTipologie = [];
        pos?.listaTipologie?.forEach((tipologiaPos: TipologiaPos) => {
            tipologiaPos?.codTipologiaDettaglio?.forEach((codTipologiaDettaglio: number) => {
                const dettaglioTipologiaTrovato = dettagliTipologie?.filter((dT: DettaglioTipologia) => dT?.codiceDettaglioTipologia === tipologiaPos?.codTipologia)[0];
                if (!dettaglioTipologiaTrovato) {
                    const dettaglioTipologia = this.dettagliTipologie?.filter((dT: DettaglioTipologia) => dT?.codiceTipologia === tipologiaPos?.codTipologia && dT?.codiceDettaglioTipologia === codTipologiaDettaglio)[0];
                    dettagliTipologie.push(dettaglioTipologia);
                }
            });
        });
        return dettagliTipologie;
    }
}
