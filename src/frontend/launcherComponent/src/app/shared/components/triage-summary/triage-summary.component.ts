import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { getContatoreGeneriMezzo, getGeneriMezzoTriageSummary, getNoteOperatoreTriageSummary } from '../../helper/function-triage';
import { SetSchedaContattoTriageSummary } from '../../store/actions/triage-summary/triage-summary.actions';
import { HelperSintesiRichiesta } from '../../../features/home/richieste/helper/_helper-sintesi-richiesta';
import { PosInterface } from '../../interface/pos.interface';
import { HttpEventType } from '@angular/common/http';
import { PosService } from '../../../core/service/pos-service/pos.service';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-triage-summary',
    templateUrl: './triage-summary.component.html',
    styleUrls: ['./triage-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriageSummaryComponent implements OnInit, OnChanges, OnDestroy {

    @Input() tipologia: Tipologia;
    @Input() dettaglioTipologia: DettaglioTipologia;
    @Input() codSchedaContatto: string;
    @Input() countInterventiProssimita: number;
    @Input() interventiProssimita: SintesiRichiesta[];
    @Input() countInterventiStessaVia: number;
    @Input() interventiStessaVia: SintesiRichiesta[];
    @Input() countInterventiChiusiStessoIndirizzo: number;
    @Input() interventiChiusiStessoIndirizzo: SintesiRichiesta[];
    @Input() triageSummary: TriageSummary[];
    @Input() pos: PosInterface[];
    @Input() schedaContatto: SchedaContatto;
    @Input() dettaglioSchedaContatto: string;

    contatoreGeneriMezzo: number;
    generiMezzo: string[];
    noteOperatore: string[];
    methods = new HelperSintesiRichiesta();
    live = true;
    infoAggiuntive = {
        pos: false,
        riepilogoTriage: true,
        noteNue: false,
        interventiInProssimita: false,
        interventiStessaVia: false,
        interventiChiusiStessoIndirizzo: false,
    };

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
        if (changes?.triageSummary?.currentValue) {
            const triageSummary = changes?.triageSummary?.currentValue;
            this.contatoreGeneriMezzo = getContatoreGeneriMezzo(triageSummary);
            this.generiMezzo = getGeneriMezzoTriageSummary(triageSummary);
            this.noteOperatore = getNoteOperatoreTriageSummary(triageSummary);
        }
        if (changes?.schedaContatto?.currentValue) {
            this.schedaContatto = changes?.schedaContatto?.currentValue;
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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

    onShowInfoAggiuntive(event: NgbPanelChangeEvent): void {
        if (event) {
            Object.keys(this.infoAggiuntive).forEach(x => x === event.panelId ? this.infoAggiuntive[x] = !this.infoAggiuntive[x] : this.infoAggiuntive[x] = false);
        }
    }
}
