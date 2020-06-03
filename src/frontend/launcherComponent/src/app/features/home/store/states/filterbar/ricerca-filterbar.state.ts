import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearRicercaFilterbar, SetRicercaFilterbar } from '../../actions/filterbar/ricerca-richieste.actions';
import { FiltriRichiesteState } from './filtri-richieste.state';

export interface RicercaFilterbarStateModel {
    ricerca: string;
}

export const RicercaFilterbarStateDefaults: RicercaFilterbarStateModel = {
    ricerca: ''
};

@State<RicercaFilterbarStateModel>({
    name: 'ricercaFilterbar',
    defaults: RicercaFilterbarStateDefaults
})
export class RicercaFilterbarState {

    constructor() { }

    @Selector()
    static ricerca(state: RicercaFilterbarStateModel) {
        return state.ricerca;
    }

    @Selector([FiltriRichiesteState])
    static ricercaRichiesteConFiltri(state: RicercaFilterbarStateModel) {
        const ricerca = state.ricerca;
        const filtri = FiltriRichiesteState.filtriRichiesteSelezionati;
        return {ricerca , filtri};
    }

    @Action(SetRicercaFilterbar)
    setRicerca({ patchState }: StateContext<RicercaFilterbarStateModel>, action: SetRicercaFilterbar) {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaFilterbar)
    clearRicercaRichieste({ patchState }: StateContext<RicercaFilterbarStateModel>) {
        patchState({
            ricerca: ''
        });
    }
}
