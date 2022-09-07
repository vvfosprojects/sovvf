import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { SetSchedaContattoTriageSummary } from '../../store/actions/triage-summary/triage-summary.actions';
import { PosInterface } from '../../interface/pos.interface';
import { HttpEventType } from '@angular/common/http';
import { PosService } from '../../../core/service/pos-service/pos.service';
import { VisualizzaDocumentoModalComponent } from '../../modal/visualizza-documento-modal/visualizza-documento-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-triage-summary-sintesi-richiesta',
    templateUrl: './triage-summary-sintesi-richiesta.component.html',
    styleUrls: ['./triage-summary-sintesi-richiesta.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriageSummarySintesiRichiestaComponent implements OnInit, OnChanges, OnDestroy {

    @Input() codSchedaContatto: string;
    @Input() triageSummary: TriageSummary[];
    @Input() pos: PosInterface[];
    @Input() schedaContatto: SchedaContatto;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private posService: PosService,
                private modalService: NgbModal) {
    }

    ngOnInit(): void {
        if (this.codSchedaContatto) {
            this.store.dispatch(new SetSchedaContattoTriageSummary(this.codSchedaContatto));
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const schedaContatto = changes?.schedaContatto?.currentValue;
        if (schedaContatto) {
            this.schedaContatto = schedaContatto;
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
}
