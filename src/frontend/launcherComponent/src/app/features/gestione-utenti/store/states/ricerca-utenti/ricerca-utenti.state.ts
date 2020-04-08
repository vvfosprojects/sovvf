import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearRicercaUtenti, SetRicercaUtenti } from '../../actions/ricerca-utenti/ricerca-utenti.actons';

export interface RicercaUtentiStateModel {
    ricerca: string;
}

export const RicercaUtentiStateDefaults: RicercaUtentiStateModel = {
    ricerca: null
};

@State<RicercaUtentiStateModel>({
    name: 'ricercaUtenti',
    defaults: RicercaUtentiStateDefaults
})
export class RicercaUtentiState {

    constructor() {
    }

    @Selector()
    static ricerca(state: RicercaUtentiStateModel) {
        return state.ricerca;
    }

    @Action(SetRicercaUtenti)
    setRicercaUtenti({ getState, patchState }: StateContext<RicercaUtentiStateModel>, action: SetRicercaUtenti) {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaUtenti)
    clearRicercaUtenti({ patchState }: StateContext<RicercaUtentiStateModel>) {
        patchState({
            ricerca: null
        });
    }
}
