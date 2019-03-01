import { Action, Selector, State, StateContext } from '@ngxs/store';

// Service
import { BoxPersonaleService } from 'src/app/core/service/boxes-service/box-personale.service';

// Model
import { BoxPersonale } from '../../../boxes/boxes-model/box-personale.model';

// Action
import { FetchBoxPersonale, SetBoxPersonale } from '../../actions/boxes/box-personale.actions';

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

    @Action(FetchBoxPersonale)
    getPersonale({ dispatch }: StateContext<BoxPersonaleStateModel>) {
        let personale: BoxPersonale;

        this._personale.getPersonale().subscribe((p: BoxPersonale) => {
            personale = p;

            dispatch(new SetBoxPersonale(personale));
        });
    }

    @Action(SetBoxPersonale)
    setPersonale({ getState, patchState }: StateContext<BoxPersonaleStateModel>, action: SetBoxPersonale) {
        const state = getState();

        patchState({
            ...state,
            personale: action.payload
        });
    }
}
