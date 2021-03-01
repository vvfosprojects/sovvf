import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { Select, Store } from '@ngxs/store';
import { TriageSummaryState } from '../../store/states/triage-summary/triage-summary.state';
import { Observable, Subscription } from 'rxjs';
import { getContatoreGeneriMezzo, getGeneriMezzoTriageSummary, getNoteOperatoreTriageSummary } from '../../helper/function-triage';
import { SetSchedaContattoTriageSummary } from '../../store/actions/triage-summary/triage-summary.actions';

@Component({
    selector: 'app-triage-summary',
    templateUrl: './triage-summary.component.html',
    styleUrls: ['./triage-summary.component.scss']
})
export class TriageSummaryComponent implements OnInit, OnDestroy {

    @Input() tipologie: Tipologia[];
    @Input() dettaglioTipologia: DettaglioTipologia;
    @Input() codSchedaContatto: string;
    @Input() countInterventiProssimita: number;
    @Input() interventiProssimita: SintesiRichiesta[];

    @Select(TriageSummaryState.summary) summary$: Observable<TriageSummary[]>;
    summary: TriageSummary[];
    @Select(TriageSummaryState.schedaContatto) schedaContatto$: Observable<SchedaContatto>;
    schedaContatto: SchedaContatto;

    contatoreGeneriMezzo: number;
    generiMezzo: string[];
    noteOperatore: string[];

    private subscription: Subscription = new Subscription();

    constructor(private store: Store) {
        this.getSummary();
        this.getSchedaContatto();
    }

    ngOnInit(): void {
        this.store.dispatch(new SetSchedaContattoTriageSummary(this.codSchedaContatto));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getSummary(): void {
        this.subscription.add(
            this.summary$.subscribe((triageSummary: TriageSummary[]) => {
                if (triageSummary) {
                    this.summary = triageSummary;
                    this.contatoreGeneriMezzo = getContatoreGeneriMezzo(this.summary);
                    this.generiMezzo = getGeneriMezzoTriageSummary(this.summary);
                    this.noteOperatore = getNoteOperatoreTriageSummary(this.summary);
                } else {
                    this.summary = null;
                }
            })
        );
    }

    getSchedaContatto(): void {
        this.subscription.add(
            this.schedaContatto$.subscribe((schedaContatto: SchedaContatto) => {
                if (schedaContatto) {
                    this.schedaContatto = schedaContatto;
                } else {
                    this.schedaContatto = null;
                }
            })
        );
    }
}
