import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { NuovaPartenza } from '../actions/nuova-partenza.actions';

export interface NuovaPartenzaStateModel {
    richiesta: SintesiRichiesta;
}

@State<NuovaPartenzaStateModel>({
    name: 'nuovaPartenza'
})

export class NuovaPartenzaState {

    @Selector()
    static getPartenza(state: NuovaPartenzaStateModel): SintesiRichiesta {
        return state.richiesta;
    }

    @Action(NuovaPartenza)
    nuovaPartenza({ getState, patchState }: StateContext<NuovaPartenzaStateModel>, action: NuovaPartenza) {
        const state = getState();
        patchState({
            ...state,
            richiesta: action.richiesta
        });
    }
}
