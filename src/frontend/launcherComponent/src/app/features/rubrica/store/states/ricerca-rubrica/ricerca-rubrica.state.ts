import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearRicercaRubrica, SetRicercaRubrica } from '../../actions/ricerca-rubrica/ricerca-rubrica.actions';
import { Injectable } from '@angular/core';

export interface RicercaRubricaStateModel {
    ricerca: string;
}

export const RicercaRubricaStateDefaults: RicercaRubricaStateModel = {
    ricerca: null
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
    static ricerca(state: RicercaRubricaStateModel) {
        return state.ricerca;
    }

    @Action(SetRicercaRubrica)
    setRicercaRubrica({ getState, patchState }: StateContext<RicercaRubricaStateModel>, action: SetRicercaRubrica) {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaRubrica)
    clearRicercaRubrica({ patchState }: StateContext<RicercaRubricaStateModel>) {
        patchState({
            ricerca: null
        });
    }
}
