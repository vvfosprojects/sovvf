import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { TriageSummary } from '../../../interface/triage-summary.interface';
import {
    ClearPosTriageSummary,
    ClearTriageSummary,
    SetPosTriageSummary,
    SetSchedaContattoTriageSummary,
    SetTriageSummary
} from '../../actions/triage-summary/triage-summary.actions';
import { SchedaContatto } from '../../../interface/scheda-contatto.interface';
import { SchedeContattoService } from '../../../../core/service/schede-contatto/schede-contatto.service';
import { PosInterface } from '../../../interface/pos.interface';

export interface TriageSummaryStateModel {
    summary: TriageSummary[];
    schedaContatto: SchedaContatto;
    pos: PosInterface[];
}

export const TriageSummaryStateDefaults: TriageSummaryStateModel = {
    summary: undefined,
    schedaContatto: undefined,
    pos: undefined
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

    @Selector()
    static pos(state: TriageSummaryStateModel): PosInterface[] {
        return state.pos;
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

    @Action(SetPosTriageSummary)
    setPosTriageSummary({ patchState }: StateContext<TriageSummaryStateModel>, action: SetPosTriageSummary): void {
        patchState({
            pos: action.pos
        });
    }

    @Action(ClearPosTriageSummary)
    clearPosTriageSummary({ patchState }: StateContext<TriageSummaryStateModel>): void {
        patchState({
            pos: TriageSummaryStateDefaults.pos
        });
    }
}
