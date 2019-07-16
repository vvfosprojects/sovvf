import { Action, Selector, State, StateContext } from '@ngxs/store';

// Action
import { SetRichiestaFissata, ClearRichiestaFissata, SetEspanso } from '../../actions/richieste/richiesta-fissata.actions';

export interface RichiestaFissataStateModel {
    idRichiestaFissata: string;
    espanso: boolean;
}

export const RichiestaFissataStateDefaults: RichiestaFissataStateModel = {
    idRichiestaFissata: null,
    espanso: false
};

@State<RichiestaFissataStateModel>({
    name: 'richiestaFissata',
    defaults: RichiestaFissataStateDefaults
})
export class RichiestaFissataState {

    constructor() {
    }

    // SELECTORS
    @Selector()
    static idRichiestaFissata(state: RichiestaFissataStateModel) {
        return state.idRichiestaFissata;
    }

    @Selector()
    static espanso(state: RichiestaFissataStateModel) {
        return state.espanso;
    }

    @Action(SetRichiestaFissata)
    setRichiestaFissata({ patchState }: StateContext<RichiestaFissataStateModel>, action: SetRichiestaFissata) {
        patchState({
            idRichiestaFissata: action.idRichiesta
        });
    }

    @Action(ClearRichiestaFissata)
    clearRichiestaFissata({ patchState }: StateContext<RichiestaFissataStateModel>) {
        patchState(RichiestaFissataStateDefaults);
    }

    @Action(SetEspanso)
    setEspanso({ getState, patchState }: StateContext<RichiestaFissataStateModel>, action: SetEspanso) {
        const state = getState();
        patchState({
            espanso: action.espanso === undefined ? !state.espanso : action.espanso
        });
    }
}
