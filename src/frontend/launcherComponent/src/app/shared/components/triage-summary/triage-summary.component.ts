import { Component, Input, OnDestroy } from '@angular/core';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { Tipologia } from '../../model/tipologia.model';
import { DettaglioTipologia } from '../../interface/dettaglio-tipologia.interface';
import { TriageSummary } from '../../interface/triage-summary.interface';
import { Select } from '@ngxs/store';
import { TriageSummaryState } from '../../store/states/triage-summary/triage-summary.state';
import { Observable, Subscription } from 'rxjs';

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

    subscription: Subscription = new Subscription();

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
                    this.setContatoreGeneriMezzo();
                    this.setGeneriMezzo();
                } else {
                    this.summary = null;
                }
            })
        );
    }

    setContatoreGeneriMezzo(): void {
        let count = 0;
        this.summary?.forEach((summary: TriageSummary) => {
            summary?.generiMezzo?.forEach((genereMezzo: string) => {
                count = count + 1;
            });
        });
        this.contatoreGeneriMezzo = count;
    }

    setGeneriMezzo(): void {
        this.summary?.forEach((summary: TriageSummary) => {
            summary?.generiMezzo?.forEach((genereMezzo: string) => {
                if (!this.generiMezzo) {
                    this.generiMezzo = [];
                }
                const genereMezzoFound = this.generiMezzo.filter((gMezzo: string) => gMezzo === genereMezzo)[0];
                if (!genereMezzoFound) {
                    this.generiMezzo.push(genereMezzo);
                }
            });
        });
    }
}
