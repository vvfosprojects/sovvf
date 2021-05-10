import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ClearRicercaPos, SetRicercaPos } from '../../actions/ricerca-pos/ricerca-pos.actions';

export interface RicercaPosStateModel {
    ricerca: string;
}

export const RicercaPosStateDefaults: RicercaPosStateModel = {
    ricerca: undefined
};

@Injectable()
@State<RicercaPosStateModel>({
    name: 'ricercaPos',
    defaults: RicercaPosStateDefaults
})
export class RicercaPosState {

    constructor() {
    }

    @Selector()
    static ricerca(state: RicercaPosStateModel): string {
        return state.ricerca;
    }

    @Action(SetRicercaPos)
    setRicercaPos({ getState, patchState }: StateContext<RicercaPosStateModel>, action: SetRicercaPos): void {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaPos)
    clearRicercaPos({ patchState }: StateContext<RicercaPosStateModel>): void {
        patchState({
            ricerca: RicercaPosStateDefaults.ricerca
        });
    }
}
