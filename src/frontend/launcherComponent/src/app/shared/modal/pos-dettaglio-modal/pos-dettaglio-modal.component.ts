import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PosInterface } from '../../interface/pos.interface';
import { AuthState } from '../../../features/auth/store/auth.state';
import { HttpEventType } from '@angular/common/http';
import { PosService } from '../../../core/service/pos-service/pos.service';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-pos-dettaglio-modal',
    templateUrl: './pos-dettaglio-modal.component.html',
    styleUrls: ['./pos-dettaglio-modal.component.css']
})
export class PosDettaglioModalComponent {

    pos: PosInterface[];
    codiceRichiesta: string;
    titolo: string;

    constructor(public modal: NgbActiveModal,
                private store: Store,
                private posService: PosService) {
    }

    onViewPos(pos: PosInterface): void {
        const codSede = this.store.selectSnapshot(AuthState.currentUser)?.sede?.codice;
        if (codSede) {
            this.posService.getPosById(pos.id, codSede).subscribe((data: any) => {
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        console.error('Errore nel download del file (' + pos.fileName + ')');
                        break;
                    case HttpEventType.Response:
                        const downloadedFile = new Blob([data.body], { type: data.body.type });
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.href = URL.createObjectURL(downloadedFile);
                        a.target = '_blank';
                        a.click();
                        document.body.removeChild(a);
                        break;
                }
            }, () => console.log('Errore visualizzazione POS'));
        } else {
            console.error('CodSede utente non trovato');
        }
    }

    onDownloadPos(pos: PosInterface): void {
        const codSede = this.store.selectSnapshot(AuthState.currentUser)?.sede?.codice;
        if (codSede) {
            this.posService.getPosById(pos.id, codSede).subscribe((data: any) => {
                switch (data.type) {
                    case HttpEventType.DownloadProgress:
                        console.error('Errore nel download del file (' + pos.fileName + ')');
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
            }, () => console.log('Errore Stampa POS'));
        } else {
            console.error('CodSede utente non trovato');
        }
    }

    onClose(): void {
        this.modal.dismiss('ko');
    }
}
