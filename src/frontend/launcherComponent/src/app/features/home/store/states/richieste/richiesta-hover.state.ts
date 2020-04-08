import { Action, Selector, State, StateContext } from '@ngxs/store';

// Action
import { SetRichiestaHover, ClearRichiestaHover } from '../../actions/richieste/richiesta-hover.actions';

export interface RichiestaHoverStateModel {
    idRichiestaHover: string;
}

export const RichiestaHoverStateDefaults: RichiestaHoverStateModel = {
    idRichiestaHover: null
};

@State<RichiestaHoverStateModel>({
    name: 'richiestaHover',
    defaults: RichiestaHoverStateDefaults
})
export class RichiestaHoverState {

    constructor() { }

    // SELECTORS
    @Selector()
    static idRichiestaHover(state: RichiestaHoverStateModel) {
        return state.idRichiestaHover;
    }

    // SET
    @Action(SetRichiestaHover)
    setRichiestaHover({ getState, patchState }: StateContext<RichiestaHoverStateModel>, action: SetRichiestaHover) {
        const state = getState();

        patchState({
            ...state,
            idRichiestaHover: action.idRichiesta
        });
    }

    // CLEAR
    @Action(ClearRichiestaHover)
    clearRichiestaHover({ getState, patchState }: StateContext<RichiestaHoverStateModel>) {
        const state = getState();

        patchState({
            ...state,
            idRichiestaHover: null
        });
    }
}
