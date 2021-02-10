import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { TriageSummary } from '../../../interface/triage-summary.interface';
import { ClearTriageSummary, SetTriageSummary } from '../../actions/triage-summary/triage-summary.actions';

export interface TriageSummaryStateModel {
    summary: TriageSummary[];
}

export const TriageSummaryStateDefaults: TriageSummaryStateModel = {
    summary: undefined
};

@Injectable()
@State<TriageSummaryStateModel>({
    name: 'triageSummary',
    defaults: TriageSummaryStateDefaults
})

export class TriageSummaryState {

    constructor() {
    }

    @Selector()
    static summary(state: TriageSummaryStateModel): TriageSummary[] {
        return state.summary;
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
            summary: TriageSummaryStateDefaults.summary
        });
    }
}
