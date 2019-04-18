import { Action, Selector, State, StateContext } from '@ngxs/store';

// Service
import { BoxMezziService } from 'src/app/core/service/boxes-service/box-mezzi.service';

// Model
import { BoxMezzi } from '../../../boxes/boxes-model/box-mezzi.model';

// Action
import { SetBoxMezzi, GetBoxMezzi, ClearBoxMezzi } from '../../actions/boxes/box-mezzi.actions';
import { ShowToastr } from '../../../../../shared/store/actions/toastr/toastr.actions';

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

    @Action(GetBoxMezzi)
    getBoxMezzi({ dispatch }: StateContext<BoxMezziStateModel>, action: GetBoxMezzi) {
        this._mezzi.getMezzi(action.connectionId).subscribe(() => {
            // dispatch(new SetBoxMezzi(m));
        }, () => dispatch(new ShowToastr('error', 'Errore', 'Il server web non risponde', 5000)));
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
