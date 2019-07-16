import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddRichiestaEspansa, ClearRichiesteEspanse, ReducerRichiesteEspanse, RemoveRichiestaEspansa } from '../../actions/richieste/richieste-espanse.actions';
import { insertItem, patch, removeItem } from '@ngxs/store/operators';

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

    @Action(ClearRichiesteEspanse)
    clearRichiesteEspanse({ patchState }: StateContext<RichiesteEspanseStateModel>) {
        patchState(RichiesteEspanseStateDefaults);
    }

    @Action(ReducerRichiesteEspanse)
    reducerRichiesteEspanse({ getState, dispatch }: StateContext<RichiesteEspanseStateModel>, action: ReducerRichiesteEspanse) {
        const state = getState();
        if (action && action.idRichiesta) {
            state.richiesteEspanse.includes(action.idRichiesta) ? dispatch(new RemoveRichiestaEspansa(action.idRichiesta)) : dispatch(new AddRichiestaEspansa(action.idRichiesta));
        }
    }

    @Action(AddRichiestaEspansa)
    addRichiestaEspansa({ setState }: StateContext<RichiesteEspanseStateModel>, action: AddRichiestaEspansa) {
        setState(
            patch({
                richiesteEspanse: insertItem(action.idRichiesta)
            })
        );
    }

    @Action(RemoveRichiestaEspansa)
    removeRichiestaEspansa({ setState }: StateContext<RichiesteEspanseStateModel>, action: RemoveRichiestaEspansa) {
        setState(
            patch({
                richiesteEspanse: removeItem<string>(idRichiesta => idRichiesta === action.idRichiesta)
            })
        );
    }

}
