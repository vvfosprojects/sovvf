import { Action, Selector, State, StateContext } from '@ngxs/store';

// Action
import { SetRichiestaSelezionata, ClearRichiestaSelezionata } from '../actions/richiesta-selezionata.actions';

export interface RichiestaSelezionataStateModel {
    idRichiestaSelezionata: string;
}

export const RichiestaSelezionataStateDefaults: RichiestaSelezionataStateModel = {
    idRichiestaSelezionata: null
};

@State<RichiestaSelezionataStateModel>({
    name: 'richiestaSelezionata',
    defaults: RichiestaSelezionataStateDefaults
})
export class RichiestaSelezionataState {

    constructor() { }

    // SELECTORS
    @Selector()
    static idRichiestaSelezionata(state: RichiestaSelezionataStateModel) {
        return state.idRichiestaSelezionata;
    }

    // SET
    @Action(SetRichiestaSelezionata)
    setRichiestaSelezionata({ getState, patchState }: StateContext<RichiestaSelezionataStateModel>, action: SetRichiestaSelezionata) {
        const state = getState();

        patchState({
            ...state,
            idRichiestaSelezionata: action.idRichiesta
        });
    }

    // CLEAR
    @Action(ClearRichiestaSelezionata)
    clearRichiestaSelezionata({ getState, patchState }: StateContext<RichiestaSelezionataStateModel>) {
        const state = getState();

        patchState({
            ...state,
            idRichiestaSelezionata: null
        });
    }
}
