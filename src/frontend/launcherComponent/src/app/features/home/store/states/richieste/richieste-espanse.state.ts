import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { AddRichiestaEspansa, ClearRichiesteEspanse, ReducerRichiesteEspanse, RemoveRichiestaEspansa } from '../../actions/richieste/richieste-espanse.actions';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';
import { RichiestaGestioneState } from './richiesta-gestione.state';
import { ClearRichiestaGestione } from '../../actions/richieste/richiesta-gestione.actions';

export interface RichiesteEspanseStateModel {
    richiesteEspanse: string[];
}

export const RichiesteEspanseStateDefaults: RichiesteEspanseStateModel = {
    richiesteEspanse: []
};

@State<RichiesteEspanseStateModel>({
    name: 'richiesteEspanse',
    defaults: RichiesteEspanseStateDefaults,
})
export class RichiesteEspanseState {

    @Selector()
    static richiesteEspanse(state: RichiesteEspanseStateModel) {
        return state.richiesteEspanse;
    }

    constructor(private store: Store) {
    }

    @Action(ClearRichiesteEspanse)
    clearRichiesteEspanse({ getState, patchState, dispatch }: StateContext<RichiesteEspanseStateModel>) {
        const state = getState();
        const idRichiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.richiestaGestione) ? this.store.selectSnapshot(RichiestaGestioneState.richiestaGestione).id : null;

        if (state && state.richiesteEspanse) {
            // cotrollo se ci sono richieste in gestione, se si la richiesta diventa "non in gestione"
            state.richiesteEspanse.forEach((idRichiesta: string) => {
                if (idRichiesta === idRichiestaGestione) {
                    dispatch(new ClearRichiestaGestione(idRichiesta));
                }
            });
            patchState(RichiesteEspanseStateDefaults);
        }
    }

    @Action(ReducerRichiesteEspanse)
    reducerRichiesteEspanse({ getState, dispatch }: StateContext<RichiesteEspanseStateModel>, action: ReducerRichiesteEspanse) {
        const state = getState();
        if (action && action.idRichiesta) {
            state.richiesteEspanse.includes(action.idRichiesta) ? dispatch(new RemoveRichiestaEspansa(action.idRichiesta)) : dispatch(new AddRichiestaEspansa(action.idRichiesta));
        }
    }

    @Action(AddRichiestaEspansa)
    addRichiestaEspansa({ getState, setState }: StateContext<RichiesteEspanseStateModel>, action: AddRichiestaEspansa) {
        const state = getState();
        if (!state.richiesteEspanse.includes(action.idRichiesta)) {
            setState(
                patch({
                    richiesteEspanse: insertItem(action.idRichiesta)
                })
            );
        }
    }

    @Action(RemoveRichiestaEspansa)
    removeRichiestaEspansa({ getState, setState, dispatch }: StateContext<RichiesteEspanseStateModel>, action: RemoveRichiestaEspansa) {
        const state = getState();
        if (state.richiesteEspanse.includes(action.idRichiesta)) {
            setState(
                patch({
                    richiesteEspanse: removeItem<string>(idRichiesta => idRichiesta === action.idRichiesta)
                })
            );
        }

        // cotrollo se la richiesta che si sta rimuovendo dalle espanse era in gestione, se si la richiesta diventa "non in gestione"
        const idRichiestaGestione = this.store.selectSnapshot(RichiestaGestioneState.richiestaGestione) ? this.store.selectSnapshot(RichiestaGestioneState.richiestaGestione).id : null;
        if (action.idRichiesta === idRichiestaGestione) {
            dispatch(new ClearRichiestaGestione(action.idRichiesta));
        }
    }

}
