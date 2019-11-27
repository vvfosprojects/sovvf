import { Action, Selector, State, StateContext } from '@ngxs/store';

// Action
import { SetRicercaRichieste } from '../../actions/filterbar/ricerca-richieste.actions';

// State
import { FiltriRichiesteState } from './filtri-richieste.state';

export interface RicercaRichiesteStateModel {
    ricerca: string;
}

export const RicercaRichiesteStateDefaults: RicercaRichiesteStateModel = {
    ricerca: ''
};

@State<RicercaRichiesteStateModel>({
    name: 'ricercaRichieste',
    defaults: RicercaRichiesteStateDefaults,
    children: [FiltriRichiesteState]
})
export class RicercaRichiesteState {

    constructor() { }

    // SELECTORS
    @Selector()
    static ricerca(state: RicercaRichiesteStateModel) {
        return state.ricerca;
    }

    // @Selector([FiltriRichiesteState])
    // static ricercaConFiltri(state: RicercaRichiesteStateModel) {
    //     const ricerca = state.ricerca;
    //     const filtri = FiltriRichiesteState.filtriSelezionati;
    //
    //     return {ricerca: ricerca, filtri: filtri};
    // }

    @Action(SetRicercaRichieste)
    setRicerca({ getState, patchState }: StateContext<RicercaRichiesteStateModel>, action: SetRicercaRichieste) {
        const state = getState();

        patchState({
            ...state,
            ricerca: action.ricerca
        });
    }
}
