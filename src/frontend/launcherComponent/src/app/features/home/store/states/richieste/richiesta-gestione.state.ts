import { Action, Selector, State, StateContext } from '@ngxs/store';

// Model
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

// Action
import { ClearRichiestaGestione, SetRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';
import { ClearRichiestaSelezionata } from '../../actions/richieste/richiesta-selezionata.actions';
import { AddRichiestaEspansa } from '../../actions/richieste/richieste-espanse.actions';

export interface RichiestaGestioneStateModel {
    richiestaGestione: SintesiRichiesta;
}

export const RichiestaGestioneStateDefaults: RichiestaGestioneStateModel = {
    richiestaGestione: null
};

@State<RichiestaGestioneStateModel>({
    name: 'richiestaGestione',
    defaults: RichiestaGestioneStateDefaults
})
export class RichiestaGestioneState {

    constructor() {
    }

    @Selector()
    static richiestaGestione(state: RichiestaGestioneStateModel) {
        return state.richiestaGestione;
    }

    @Action(SetRichiestaGestione)
    setRichiestaGestione({ getState, patchState, dispatch }: StateContext<RichiestaGestioneStateModel>, action: SetRichiestaGestione) {
        const state = getState();
        if (state.richiestaGestione && state.richiestaGestione.id === action.richiesta.id && !action.toggle) {
            dispatch(new ClearRichiestaGestione());
            dispatch(new ClearRichiestaSelezionata());
        } else {
            patchState({
                richiestaGestione: action.richiesta
            });
            dispatch(new AddRichiestaEspansa(action.richiesta.id));
        }
    }

    @Action(ClearRichiestaGestione)
    clearRichiestaGestione({ patchState }: StateContext<RichiestaGestioneStateModel>) {
        patchState(RichiestaGestioneStateDefaults);
    }
}
