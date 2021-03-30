import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ClearRicercaRubricaPersonale, SetRicercaRubricaPersonale } from '../../actions/ricerca-rubrica-personale/ricerca-rubrica-personale.actions';

export interface RicercaRubricaPersonaleStateModel {
    ricerca: string;
}

export const RicercaRubricaPersonaleStateDefaults: RicercaRubricaPersonaleStateModel = {
    ricerca: null
};

@Injectable()
@State<RicercaRubricaPersonaleStateModel>({
    name: 'ricercaRubricaPersonale',
    defaults: RicercaRubricaPersonaleStateDefaults
})
export class RicercaRubricaPersonaleState {

    constructor() {
    }

    @Selector()
    static ricerca(state: RicercaRubricaPersonaleStateModel): string {
        return state.ricerca;
    }

    @Action(SetRicercaRubricaPersonale)
    setRicercaRubrica({ getState, patchState }: StateContext<RicercaRubricaPersonaleStateModel>, action: SetRicercaRubricaPersonale): void {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaRubricaPersonale)
    clearRicercaRubricaPersonale({ patchState }: StateContext<RicercaRubricaPersonaleStateModel>): void {
        patchState({
            ricerca: null
        });
    }
}
