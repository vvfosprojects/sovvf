import { Action, Selector, State, StateContext } from '@ngxs/store';

// Model
import { BoxMezzi } from '../../../boxes/boxes-model/box-mezzi.model';

// Action
import { SetBoxMezzi, ClearBoxMezzi } from '../../actions/boxes/box-mezzi.actions';

export interface BoxMezziStateModel {
    mezzi: BoxMezzi;
}

export const boxMezziStateDefaults: BoxMezziStateModel = {
    mezzi: null,
};

@State<BoxMezziStateModel>({
    name: 'boxMezzi',
    defaults: boxMezziStateDefaults
})
export class BoxMezziState {

    constructor() {
    }

    @Selector()
    static mezzi(state: BoxMezziStateModel) {
        return state.mezzi;
    }

    @Action(SetBoxMezzi)
    setBoxMezzi({ patchState }: StateContext<BoxMezziStateModel>, action: SetBoxMezzi) {
        patchState({
            mezzi: action.payload
        });
    }

    @Action(ClearBoxMezzi)
    clearBoxMezzi({ patchState }: StateContext<BoxMezziStateModel>) {
        patchState(boxMezziStateDefaults);
    }
}
