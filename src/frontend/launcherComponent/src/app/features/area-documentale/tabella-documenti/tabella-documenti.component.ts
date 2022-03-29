import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentoInterface } from '../../../shared/interface/documento.interface';

@Component({
    selector: 'app-tabella-documenti',
    templateUrl: './tabella-documenti.component.html',
    styleUrls: ['./tabella-documenti.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
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

    constructor() {
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
}
