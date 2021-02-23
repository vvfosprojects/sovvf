import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { TriageSummary } from '../../../interface/triage-summary.interface';
import { ClearTriageSummary, SetSchedaContattoTriageSummary, SetTriageSummary } from '../../actions/triage-summary/triage-summary.actions';
import { SchedaContatto } from '../../../interface/scheda-contatto.interface';
import { SchedeContattoService } from '../../../../core/service/schede-contatto/schede-contatto.service';

export interface TriageSummaryStateModel {
    summary: TriageSummary[];
    schedaContatto: SchedaContatto;
}

export const TriageSummaryStateDefaults: TriageSummaryStateModel = {
    summary: undefined,
    schedaContatto: undefined
};

@Injectable()
@State<TriageSummaryStateModel>({
    name: 'triageSummary',
    defaults: TriageSummaryStateDefaults
})

export class TriageSummaryState {

    constructor(private schedeContattoService: SchedeContattoService) {
    }

    @Selector()
    static summary(state: TriageSummaryStateModel): TriageSummary[] {
        return state.summary;
    }

    @Selector()
    static schedaContatto(state: TriageSummaryStateModel): SchedaContatto {
        return state.schedaContatto;
    }

    @Action(SetTriageSummary)
    setTriageSummary({ patchState }: StateContext<TriageSummaryStateModel>, action: SetTriageSummary): void {
        patchState({
            summary: action.triageSummary
        });
    }

    @Action(ClearTriageSummary)
    clearTriageSummary({ patchState }: StateContext<TriageSummaryStateModel>): void {
        patchState({
            summary: TriageSummaryStateDefaults.summary,
            schedaContatto: TriageSummaryStateDefaults.schedaContatto
        });
    }

    @Action(SetSchedaContattoTriageSummary)
    setSchedaContattoTriageSummary({ patchState }: StateContext<TriageSummaryStateModel>, action: SetSchedaContattoTriageSummary): void {
        this.schedeContattoService.getSchedaContatto(action.codScheda).subscribe((schedaContatto: SchedaContatto) => {
            patchState({
                schedaContatto
            });
        });
    }
}
