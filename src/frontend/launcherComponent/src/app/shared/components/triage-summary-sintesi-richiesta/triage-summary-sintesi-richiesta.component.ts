import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { SetSchedaContattoTriageSummary } from '../../store/actions/triage-summary/triage-summary.actions';
import { PosInterface } from '../../interface/pos.interface';
import { HttpEventType } from '@angular/common/http';
import { PosService } from '../../../core/service/pos-service/pos.service';

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
                private posService: PosService) {
    }

    ngOnInit(): void {
        if (this.codSchedaContatto) {
            this.store.dispatch(new SetSchedaContattoTriageSummary(this.codSchedaContatto));
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.schedaContatto?.currentValue) {
            const schedaContatto = changes?.schedaContatto?.currentValue;
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
        }, error => console.log('Errore Stampa POS'));
    }

    onViewPos(pos: PosInterface): void {
        this.posService.getPosById(pos.id).subscribe((data: any) => {
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
        }, error => console.log('Errore visualizzazione POS'));
    }
}
