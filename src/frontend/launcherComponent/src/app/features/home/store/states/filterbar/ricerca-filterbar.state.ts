import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClearRicercaFilterbar, SetRicercaFilterbar } from '../../actions/filterbar/ricerca-richieste.actions';
import { FiltriRichiesteState } from './filtri-richieste.state';
import { Injectable } from '@angular/core';

export interface RicercaFilterbarStateModel {
    ricerca: string;
}

export const RicercaFilterbarStateDefaults: RicercaFilterbarStateModel = {
    ricerca: ''
};

@Injectable()
@State<RicercaFilterbarStateModel>({
    name: 'ricercaFilterbar',
    defaults: RicercaFilterbarStateDefaults
})
export class RicercaFilterbarState {

    constructor() {
    }

    @Selector()
    static ricerca(state: RicercaFilterbarStateModel): string {
        return state.ricerca;
    }

    @Selector([FiltriRichiesteState])
    static ricercaRichiesteConFiltri(state: RicercaFilterbarStateModel): any {
        const ricerca = state.ricerca;
        const filtri = FiltriRichiesteState.filtriRichiesteSelezionati;
        return { ricerca, filtri };
    }

    @Action(SetRicercaFilterbar)
    setRicerca({ patchState }: StateContext<RicercaFilterbarStateModel>, action: SetRicercaFilterbar): void {
        patchState({
            ricerca: action.ricerca
        });
    }

    @Action(ClearRicercaFilterbar)
    clearRicercaRichieste({ patchState }: StateContext<RicercaFilterbarStateModel>): void {
        patchState({
            ricerca: ''
        });
    }
}
