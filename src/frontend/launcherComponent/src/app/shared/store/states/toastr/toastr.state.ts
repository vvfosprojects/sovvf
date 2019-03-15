import { Action, State, StateContext } from '@ngxs/store';

// Service
import { ToastrService } from 'ngx-toastr';

// Action
import { SetToastr, ShowToastr } from '../../actions/toastr/toastr.actions';

export interface ToastrStateModel {
    type: string;
    title: string;
    message: string;
    timeout?: number;
}

export const toastrStateDefaults: ToastrStateModel = {
    type: null,
    title: null,
    message: null,
    timeout: 5000
};

@State<ToastrStateModel>({
    name: 'toastr',
    defaults: toastrStateDefaults
})
export class ToastrState {

    constructor(private _toastr: ToastrService) {
    }

    @Action(ShowToastr)
    showToastr({getState, dispatch}: StateContext<ToastrStateModel>, action: ShowToastr) {
        dispatch(new SetToastr(action.type, action.title, action.message, action.duration));
    }

    @Action(SetToastr)
    setToastr({getState, patchState}: StateContext<ToastrStateModel>, action: SetToastr) {
        patchState({
            type: action.type,
            title: action.title,
            message: action.message,
            timeout: action.timeout
        });

        const state = getState();

        this._toastr[state.type](state.message, state.title, {timeOut: state.timeout});
    }
}
