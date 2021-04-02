import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
    ClearRicercaRubricaPersonale,
    ClearStatoRubricaPersonale, ClearTipoRubricaPersonale,
    SetRicercaRubricaPersonale,
    SetStatoRubricaPersonale, SetTipoRubricaPersonale
} from '../../actions/ricerca-rubrica-personale/ricerca-rubrica-personale.actions';

export interface RicercaRubricaPersonaleStateModel {
    ricerca: string;
    stato: string;
    tipo: string;
}

export const RicercaRubricaPersonaleStateDefaults: RicercaRubricaPersonaleStateModel = {
    ricerca: undefined,
    stato: undefined,
    tipo: undefined,
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
    static stato(state: RicercaRubricaPersonaleStateModel): string {
        return state.stato;
    }

    @Selector()
    static tipo(state: RicercaRubricaPersonaleStateModel): string {
        return state.tipo;
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

    @Action(SetTipoRubricaPersonale)
    setTipoRubricaPersonale({ getState, patchState }: StateContext<RicercaRubricaPersonaleStateModel>, action: SetTipoRubricaPersonale): void {
        patchState({
            tipo: action.tipo
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

    @Action(ClearTipoRubricaPersonale)
    clearTipoRubricaPersonale({ patchState }: StateContext<RicercaRubricaPersonaleStateModel>): void {
        patchState({
            tipo: RicercaRubricaPersonaleStateDefaults.tipo
        });
    }
}
