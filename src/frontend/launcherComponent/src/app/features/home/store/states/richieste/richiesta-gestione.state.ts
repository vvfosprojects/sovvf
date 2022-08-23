import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';
import { ClearRichiestaGestione, SetRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';
import { Injectable } from '@angular/core';

export interface RichiestaGestioneStateModel {
    richiestaGestione: SintesiRichiesta;
}

export const RichiestaGestioneStateDefaults: RichiestaGestioneStateModel = {
    richiestaGestione: null
};

@Injectable()
@State<RichiestaGestioneStateModel>({
    name: 'richiestaGestione',
    defaults: RichiestaGestioneStateDefaults
})
export class RichiestaGestioneState {

    @Selector()
    static richiestaGestione(state: RichiestaGestioneStateModel): SintesiRichiesta {
        return state.richiestaGestione;
    }

    @Selector()
    static idRichiestaGestione(state: RichiestaGestioneStateModel): string {
        return state.richiestaGestione ? state.richiestaGestione.id : null;
    }

    @Action(SetRichiestaGestione)
    setRichiestaGestione({ getState, patchState, dispatch }: StateContext<RichiestaGestioneStateModel>, action: SetRichiestaGestione): void {
        const state = getState();
        if (state.richiestaGestione && state.richiestaGestione.codice === action.richiesta.codice && !action.toggle) {
            dispatch(new ClearRichiestaGestione());
        } else {
            patchState({
                richiestaGestione: action.richiesta
            });
        }
    }

    @Action(ClearRichiestaGestione)
    clearRichiestaGestione({ patchState }: StateContext<RichiestaGestioneStateModel>): void {
        patchState(RichiestaGestioneStateDefaults);
    }
}
