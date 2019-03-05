import { Action, Selector, State, StateContext } from '@ngxs/store';

// Action
import { SetRicerca } from '../../actions/filterbar/ricerca-richieste.actions';

// State
import { FiltriRichiesteState } from './filtri-richieste.state';

export interface RicercaRichiesteStateModel {
    ricerca: any;
}

export const RicercaRichiesteStateDefaults: RicercaRichiesteStateModel = {
    ricerca: { descrizione: '' }
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

    // GET
    @Action(SetRicerca)
    setRicerca({ getState, patchState }: StateContext<RicercaRichiesteStateModel>, action: SetRicerca) {
        const state = getState();

        patchState({
            ...state,
            ricerca: action.ricerca
        });
    }
}
