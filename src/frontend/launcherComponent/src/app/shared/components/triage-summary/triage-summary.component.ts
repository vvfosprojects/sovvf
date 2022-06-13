import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
import { NgbModal, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { VisualizzaDocumentoModalComponent } from '../../modal/visualizza-documento-modal/visualizza-documento-modal.component';

@Component({
    selector: 'app-triage-summary',
    templateUrl: './triage-summary.component.html',
    styleUrls: ['./triage-summary.component.scss']
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
    @Input() idRichiestaModifica: string;

    countInterventiProssimitaFiltered: number;
    interventiProssimitaFiltered: SintesiRichiesta[];
    countInterventiStessaViaFiltered: number;
    interventiStessaViaFiltered: SintesiRichiesta[];

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
        interventiChiusiStessoIndirizzo: false
    };

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
        if (changes?.triageSummary?.currentValue) {
            const triageSummary = changes?.triageSummary?.currentValue;
            this.contatoreGeneriMezzo = getContatoreGeneriMezzo(triageSummary);
            this.generiMezzo = getGeneriMezzoTriageSummary(triageSummary);
            this.noteOperatore = getNoteOperatoreTriageSummary(triageSummary);
        }
        if (changes?.schedaContatto?.currentValue) {
            this.schedaContatto = changes?.schedaContatto?.currentValue;
        }
        if (changes?.countInterventiProssimita?.currentValue) {
            this.countInterventiProssimitaFiltered = this.countInterventiProssimita;
            if (this.idRichiestaModifica) {
                this.filterCountInterventiProssimita();
            }
        } else if (!changes?.countInterventiProssimita?.currentValue && changes?.countInterventiProssimita?.previousValue) {
            this.countInterventiProssimitaFiltered = null;
        }
        if (changes?.interventiProssimita?.currentValue) {
            this.interventiProssimitaFiltered = this.interventiProssimita;
            if (this.idRichiestaModifica) {
                this.filterInterventiProssimita();
            }
        } else if (!changes?.interventiProssimita?.currentValue && changes?.interventiProssimita?.previousValue) {
            this.interventiProssimitaFiltered = null;
        }
        if (changes?.countInterventiStessaVia?.currentValue) {
            this.countInterventiStessaViaFiltered = this.countInterventiStessaVia;
            if (this.idRichiestaModifica) {
                this.filterCountInterventiStessaVia();
            }
        } else if (!changes?.countInterventiStessaVia?.currentValue && changes?.countInterventiStessaVia?.previousValue) {
            this.countInterventiStessaViaFiltered = null;
        }
        if (changes?.interventiStessaVia?.currentValue) {
            this.interventiStessaViaFiltered = this.interventiStessaVia;
            if (this.idRichiestaModifica) {
                this.filterInterventiStessaVia();
            }
        } else if (!changes?.interventiStessaVia?.currentValue && changes?.interventiStessaVia?.previousValue) {
            this.interventiStessaViaFiltered = null;
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    filterCountInterventiProssimita(): void {
        this.countInterventiProssimitaFiltered = this.countInterventiProssimitaFiltered - this.interventiProssimita.filter((r: SintesiRichiesta) => r.id === this.idRichiestaModifica)?.length;
    }

    filterInterventiProssimita(): void {
        this.interventiProssimitaFiltered = this.interventiProssimita.filter((r: SintesiRichiesta) => r.id !== this.idRichiestaModifica);
    }

    filterCountInterventiStessaVia(): void {
        this.countInterventiStessaViaFiltered = this.countInterventiStessaViaFiltered - this.interventiStessaVia.filter((r: SintesiRichiesta) => r.id === this.idRichiestaModifica)?.length;
    }

    filterInterventiStessaVia(): void {
        this.interventiStessaViaFiltered = this.interventiStessaVia.filter((r: SintesiRichiesta) => r.id !== this.idRichiestaModifica);
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
        }, () => console.log('Errore Stampa POS'));
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
            }, () => console.log('Errore visualizzazione POS'));
        } else {
            this.onDownloadPos(pos);
        }
    }

    onShowInfoAggiuntive(event: NgbPanelChangeEvent): void {
        if (event) {
            Object.keys(this.infoAggiuntive).forEach(x => x === event.panelId ? this.infoAggiuntive[x] = !this.infoAggiuntive[x] : this.infoAggiuntive[x] = false);
        }
    }
}
