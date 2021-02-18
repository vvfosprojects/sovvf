import { Component, Input, OnDestroy } from '@angular/core';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { Select } from '@ngxs/store';
import { TriageSummaryState } from '../../store/states/triage-summary/triage-summary.state';
import { Observable, Subscription } from 'rxjs';
import { getContatoreGeneriMezzo, getGeneriMezzoTriageSummary } from '../../helper/function-triage';

@Component({
    selector: 'app-triage-summary',
    templateUrl: './triage-summary.component.html',
    styleUrls: ['./triage-summary.component.scss']
})
export class TriageSummaryComponent implements OnDestroy {

    @Input() tipologie: Tipologia[];
    @Input() dettaglioTipologia: DettaglioTipologia;
    @Input() schedaContatto: SchedaContatto;
    @Input() countInterventiProssimita: number;
    @Input() interventiProssimita: SintesiRichiesta[];

    @Select(TriageSummaryState.summary) summary$: Observable<TriageSummary[]>;
    summary: TriageSummary[];

    contatoreGeneriMezzo: number;
    generiMezzo: string[];

    private subscription: Subscription = new Subscription();

    constructor() {
        this.getSummary();
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
                } else {
                    this.summary = null;
                }
            })
        );
    }
}
