import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
    ClearRicercaRubricaPersonale,
    ClearStatoRubricaPersonale,
    SetRicercaRubricaPersonale,
    SetStatoRubricaPersonale
} from '../../actions/ricerca-rubrica-personale/ricerca-rubrica-personale.actions';

export interface RicercaRubricaPersonaleStateModel {
    ricerca: string;
    stato: string[];
}

export const RicercaRubricaPersonaleStateDefaults: RicercaRubricaPersonaleStateModel = {
    ricerca: undefined,
    stato: undefined,
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

    @Selector()
    static stato(state: RicercaRubricaPersonaleStateModel): string[] {
        return state.stato;
    }

    @Action(SetRicercaRubricaPersonale)
    setRicercaRubrica({ getState, patchState }: StateContext<RicercaRubricaPersonaleStateModel>, action: SetRicercaRubricaPersonale): void {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(SetStatoRubricaPersonale)
    setStatoRubricaPersonale({ getState, patchState }: StateContext<RicercaRubricaPersonaleStateModel>, action: SetStatoRubricaPersonale): void {
        patchState({
            stato: action.stato
        });
    }

    @Action(ClearRicercaRubricaPersonale)
    clearRicercaRubricaPersonale({ patchState }: StateContext<RicercaRubricaPersonaleStateModel>): void {
        patchState({
            ricerca: RicercaRubricaPersonaleStateDefaults.ricerca
        });
    }

    @Action(ClearStatoRubricaPersonale)
    clearStatoRubricaPersonale({ patchState }: StateContext<RicercaRubricaPersonaleStateModel>): void {
        patchState({
            stato: RicercaRubricaPersonaleStateDefaults.stato
        });
    }
}
