import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BoxMezzi } from '../../../boxes/boxes-model/box-mezzi.model';
import { SetBoxMezzi, ClearBoxMezzi } from '../../actions/boxes/box-mezzi.actions';
import { Injectable } from '@angular/core';

export interface BoxMezziStateModel {
    mezzi: BoxMezzi;
}

export const boxMezziStateDefaults: BoxMezziStateModel = {
    mezzi: null,
};

@Injectable()
@State<BoxMezziStateModel>({
    name: 'boxMezzi',
    defaults: boxMezziStateDefaults
})
export class BoxMezziState {

    constructor() {
    }

    @Selector()
    static mezzi(state: BoxMezziStateModel): BoxMezzi {
        return state.mezzi;
    }

    @Action(SetBoxMezzi)
    setBoxMezzi({ patchState }: StateContext<BoxMezziStateModel>, action: SetBoxMezzi): void {
        patchState({
            mezzi: action.payload
        });
    }

    @Action(ClearBoxMezzi)
    clearBoxMezzi({ patchState }: StateContext<BoxMezziStateModel>): void {
        patchState(boxMezziStateDefaults);
    }
}
