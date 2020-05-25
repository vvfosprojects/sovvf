import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearRicercaUtenti, ClearSediFiltro, SetRicercaUtenti, SetSediFiltro } from '../../actions/ricerca-utenti/ricerca-utenti.actons';

export interface RicercaUtentiStateModel {
    ricerca: string;
    sediFiltro: string[];
}

export const RicercaUtentiStateDefaults: RicercaUtentiStateModel = {
    ricerca: null,
    sediFiltro: []
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

    @Selector()
    static sediFiltro(state: RicercaUtentiStateModel) {
        return state.sediFiltro;
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

    @Action(SetSediFiltro)
    setSediFiltro({ getState, patchState }: StateContext<RicercaUtentiStateModel>, action: SetSediFiltro) {
        patchState({
            sediFiltro: action.sedi
        });
    }

    @Action(ClearSediFiltro)
    clearSediFiltro({ patchState }: StateContext<RicercaUtentiStateModel>) {
        patchState({
            sediFiltro: []
        });
    }
}
