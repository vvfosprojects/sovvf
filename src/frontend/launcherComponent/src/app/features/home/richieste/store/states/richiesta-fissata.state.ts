import { Action, Selector, State, StateContext } from '@ngxs/store';

// Action
import { SetRichiestaFissata, ClearRichiestaFissata } from '../actions/richiesta-fissata.actions';

export interface RichiestaFissataStateModel {
    idRichiestaFissata: string;
}

export const RichiestaFissataStateDefaults: RichiestaFissataStateModel = {
    idRichiestaFissata: null
};

@State<RichiestaFissataStateModel>({
    name: 'richiestaFissata',
    defaults: RichiestaFissataStateDefaults
})
export class RichiestaFissataState {

    constructor() { }

    // SELECTORS
    @Selector()
    static idRichiestaFissata(state: RichiestaFissataStateModel) {
        return state.idRichiestaFissata;
    }

    // SET
    @Action(SetRichiestaFissata)
    setRichiestaFissata({ getState, patchState }: StateContext<RichiestaFissataStateModel>, action: SetRichiestaFissata) {
        const state = getState();

        patchState({
            ...state,
            idRichiestaFissata: action.idRichiesta
        });
    }

    // CLEAR
    @Action(ClearRichiestaFissata)
    clearRichiestaFissata({ getState, patchState }: StateContext<RichiestaFissataStateModel>) {
        const state = getState();

        patchState({
            ...state,
            idRichiestaFissata: null
        });
    }
}
