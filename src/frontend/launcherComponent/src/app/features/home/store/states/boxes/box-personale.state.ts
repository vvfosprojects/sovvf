import { Action, Selector, State, StateContext } from '@ngxs/store';

// Service
import { BoxPersonaleService } from 'src/app/core/service/boxes-service/box-personale.service';

// Model
import { BoxPersonale } from '../../../boxes/boxes-model/box-personale.model';

// Action
import { ClearBoxPersonale, GetBoxPersonale, SetBoxPersonale } from '../../actions/boxes/box-personale.actions';

export interface BoxPersonaleStateModel {
    personale: BoxPersonale;
}

export const boxPersonaleStateDefaults: BoxPersonaleStateModel = {
    personale: null,
};

@State<BoxPersonaleStateModel>({
    name: 'boxPersonale',
    defaults: boxPersonaleStateDefaults
})
export class BoxPersonaleState {

    constructor(private _personale: BoxPersonaleService) {
    }

    @Selector()
    static personale(state: BoxPersonaleStateModel) {
        return state.personale;
    }

    @Action(GetBoxPersonale)
    getBoxPersonale({ dispatch }: StateContext<BoxPersonaleStateModel>) {
        this._personale.getPersonale().subscribe((p: BoxPersonale) => {
            dispatch(new SetBoxPersonale(p));
        });
    }

    @Action(SetBoxPersonale)
    setBoxPersonale({ patchState }: StateContext<BoxPersonaleStateModel>, action: SetBoxPersonale) {
        patchState({
            personale: action.payload
        });
    }

    @Action(ClearBoxPersonale)
    clearBoxPersonale({ patchState }: StateContext<BoxPersonaleStateModel>) {
        patchState(boxPersonaleStateDefaults);
    }
}
