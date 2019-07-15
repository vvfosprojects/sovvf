import { Action, Selector, State, StateContext } from '@ngxs/store';

// Model
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

// Action
import { ClearRichiestaGestione, SetRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';

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
    setRichiestaGestione({ patchState }: StateContext<RichiestaGestioneStateModel>, action: SetRichiestaGestione) {
        patchState({
            richiestaGestione: action.richiesta
        });
    }

    @Action(ClearRichiestaGestione)
    clearRichiestaGestione({ patchState }: StateContext<RichiestaGestioneStateModel>) {
        patchState(RichiestaGestioneStateDefaults);
    }
}
