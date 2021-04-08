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
    @Input() schedaContatto: SchedaContatto;

    contatoreGeneriMezzo: number;
    generiMezzo: string[];
    noteOperatore: string[];

    private subscription: Subscription = new Subscription();

    constructor(private store: Store) {
        // this.getSummary();
        // this.getSchedaContatto();
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
            const schedaContatto = changes?.schedaContatto?.currentValue;
            this.schedaContatto = schedaContatto;
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
