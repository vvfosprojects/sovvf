import { Action, Selector, State, StateContext } from '@ngxs/store';
import {SetRicercaUtenti} from '../../actions/ricerca-utenti/ricerca-utenti.actons';

// Action

// State

export interface RicercaUtentiStateModel {
    ricerca: any;
}

export const RicercaUtentiStateDefaults: RicercaUtentiStateModel  = {
    ricerca: { cognome: '' }
};

@State<RicercaUtentiStateModel >({
    name: 'ricercaUtenti',
    defaults: RicercaUtentiStateDefaults
})
export class RicercaUtentiState {

    constructor() { }

    // SELECTORS
    @Selector()
    static ricerca(state: RicercaUtentiStateModel) {
        return state.ricerca;
    }

    // GET
    @Action(SetRicercaUtenti)
    setRicercaUtenti({ getState, patchState }: StateContext<RicercaUtentiStateModel>, action: SetRicercaUtenti) {
        const state = getState();

        patchState({
            ...state,
            ricerca: action.ricerca
        });
    }
}
