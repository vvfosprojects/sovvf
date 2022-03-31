import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentoInterface } from '../../../shared/interface/documento.interface';
import { TipoConcorrenzaEnum } from '../../../shared/enum/tipo-concorrenza.enum';
import { LockedConcorrenzaService } from '../../../core/service/concorrenza-service/locked-concorrenza.service';

@Component({
    selector: 'app-tabella-documenti',
    templateUrl: './tabella-documenti.component.html',
    styleUrls: ['./tabella-documenti.component.css']
})
export class TabellaDocumentiComponent {

    @Input() page: number;
    @Input() pageSize: number;
    @Input() pageSizes: number[];
    @Input() totalItems: number;
    @Input() loading: boolean;
    @Input() documenti: DocumentoInterface[];

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() view: EventEmitter<DocumentoInterface> = new EventEmitter<DocumentoInterface>();
    @Output() download: EventEmitter<DocumentoInterface> = new EventEmitter<DocumentoInterface>();
    @Output() editDocumento: EventEmitter<DocumentoInterface> = new EventEmitter<DocumentoInterface>();
    @Output() deleteDocumento: EventEmitter<{ idDocumento: string, descrizioneDocumento: string, descrizioneCategoria: string }> = new EventEmitter<{ idDocumento: string, descrizioneDocumento: string, descrizioneCategoria: string }>();

    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    constructor(private lockedConcorrenzaService: LockedConcorrenzaService) {
    }

    onViewDocumento(documento: DocumentoInterface): void {
        this.view.emit(documento);
    }

    onDownloadDocumento(documento: DocumentoInterface): void {
        this.download.emit(documento);
    }

    onEditDocumento(documento: DocumentoInterface): void {
        this.editDocumento.emit(documento);
    }

    onDeleteDocumento(idDocumento: string, descrizioneDocumento: string, descrizioneCategoria: string): void {
        this.deleteDocumento.emit({ idDocumento, descrizioneDocumento, descrizioneCategoria });
    }

    getTooltipConcorrenzaText(documento: DocumentoInterface): string {
        let modificaDocumentoLocked: string;
        let eliminaDocumentoLocked: string;
        let allLocked: string;
        switch (documento.descrizioneCategoria) {
            case 'Piani Discendenti':
                modificaDocumentoLocked = this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.ModificaPianiDiscendenti, [documento.id]);
                eliminaDocumentoLocked = this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.EliminaPianiDiscendenti, [documento.id]);
                allLocked = modificaDocumentoLocked && eliminaDocumentoLocked;
                break;
        }
        if (allLocked) {
            return modificaDocumentoLocked;
        } else if (modificaDocumentoLocked) {
            return modificaDocumentoLocked;
        } else if (eliminaDocumentoLocked) {
            return eliminaDocumentoLocked;
        }
    }
}
