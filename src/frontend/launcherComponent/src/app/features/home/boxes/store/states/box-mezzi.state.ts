import { Action, Selector, State, StateContext } from '@ngxs/store';

// Service
import { BoxMezziService } from 'src/app/core/service/boxes-service/box-mezzi.service';

// Model
import { BoxMezzi } from '../../boxes-model/box-mezzi.model';

// Action
import { SetBoxMezzi, FetchBoxMezzi } from '../actions/box-mezzi.actions';

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

    constructor(private _mezzi: BoxMezziService) {
    }

    @Selector()
    static mezzi(state: BoxMezziStateModel) {
        return state.mezzi;
    }

    @Action(FetchBoxMezzi)
    getMezzi({ dispatch }: StateContext<BoxMezziStateModel>) {
        let mezzi: BoxMezzi;

        this._mezzi.getMezzi().subscribe((m: BoxMezzi) => {
            mezzi = m;

            dispatch(new SetBoxMezzi(mezzi));
        });
    }

    @Action(SetBoxMezzi)
    setMezzi({ getState, patchState }: StateContext<BoxMezziStateModel>, action: SetBoxMezzi) {
        const state = getState();

        patchState({
            ...state,
            mezzi: action.payload
        });
    }
}
