import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearRicercaRubrica, SetRicercaRubrica } from '../../actions/ricerca-rubrica/ricerca-rubrica.actions';
import { Injectable } from '@angular/core';

export interface RicercaRubricaStateModel {
    ricerca: string;
}

export const RicercaRubricaStateDefaults: RicercaRubricaStateModel = {
    ricerca: undefined
};

@Injectable()
@State<RicercaRubricaStateModel>({
    name: 'ricercaRubrica',
    defaults: RicercaRubricaStateDefaults
})
export class RicercaRubricaState {

    constructor() {
    }

    @Selector()
    static ricerca(state: RicercaRubricaStateModel): string {
        return state.ricerca;
    }

    @Action(SetRicercaRubrica)
    setRicercaRubrica({ getState, patchState }: StateContext<RicercaRubricaStateModel>, action: SetRicercaRubrica): void {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaRubrica)
    clearRicercaRubrica({ patchState }: StateContext<RicercaRubricaStateModel>): void {
        patchState({
            ricerca: RicercaRubricaStateDefaults.ricerca
        });
    }
}
