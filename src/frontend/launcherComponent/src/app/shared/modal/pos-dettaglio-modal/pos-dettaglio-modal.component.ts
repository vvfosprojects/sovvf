import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PosInterface } from '../../interface/pos.interface';
import { HttpEventType } from '@angular/common/http';
import { PosService } from '../../../core/service/pos-service/pos.service';
import { Store } from '@ngxs/store';
import { VisualizzaDocumentoModalComponent } from '../visualizza-documento-modal/visualizza-documento-modal.component';

@Component({
    selector: 'app-pos-dettaglio-modal',
    templateUrl: './pos-dettaglio-modal.component.html',
    styleUrls: ['./pos-dettaglio-modal.component.css']
})
export class PosDettaglioModalComponent {

    pos: PosInterface[];
    codiceRichiesta: string;
    titolo: string;

    constructor(public modalService: NgbModal,
                public modal: NgbActiveModal,
                private store: Store,
                private posService: PosService) {
    }

    onViewPos(pos: PosInterface): void {
        const fileNameSplit = pos.fileName.split('.');
        if (fileNameSplit[fileNameSplit.length - 1] === 'pdf') {
            this.posService.getPosById(pos.id).subscribe((data: any) => {
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        console.warn('Download del file (' + pos.fileName + ')');
                        break;
                    case HttpEventType.Response:
                        const modalVisualizzaPdf = this.modalService.open(VisualizzaDocumentoModalComponent, {
                            windowClass: 'xxlModal modal-holder',
                            backdropClass: 'light-blue-backdrop',
                            centered: true
                        });
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        modalVisualizzaPdf.componentInstance.titolo = pos?.descrizionePos?.toLocaleUpperCase();
                        modalVisualizzaPdf.componentInstance.blob = downloadedFile;
                        break;
                }
            }, () => console.error('Errore visualizzazione POS'));
        } else {
            this.onDownloadPos(pos);
        }
    }

    onDownloadPos(pos: PosInterface): void {
        this.posService.getPosById(pos.id).subscribe((data: any) => {
            switch (data.type) {
                case HttpEventType.DownloadProgress:
                    console.warn('Download del file (' + pos.fileName + ')');
                    break;
                case HttpEventType.Response:
                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.download = pos.fileName;
                    a.href = URL.createObjectURL(downloadedFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                    break;
            }
        }, () => console.error('Errore Stampa POS'));
    }

    onClose(): void {
        this.modal.dismiss('ko');
    }
}
