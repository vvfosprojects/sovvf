import { Action, State, StateContext } from '@ngxs/store';

// Service
import { ToastrService } from 'ngx-toastr';

// Action
import { SetToastr, ShowToastr } from '../../actions/toastr/toastr.actions';

export interface ToastrStateModel {
    type: string;
    title?: string;
    message?: string;
    timeout?: number;
}

export const toastrStateDefaults: ToastrStateModel = {
    type: null,
    title: null,
    message: null,
    timeout: 5
};

@State<ToastrStateModel>({
    name: 'toastr',
    defaults: toastrStateDefaults
})
export class ToastrState {

    constructor(private _toastr: ToastrService) {
    }

    @Action(ShowToastr)
    showToastr({ getState, dispatch }: StateContext<ToastrStateModel>, action: ShowToastr) {
        dispatch(new SetToastr(action.type, action.title, action.message, action.duration, action.tapToDismiss));
    }

    @Action(SetToastr)
    setToastr({ patchState }: StateContext<ToastrStateModel>, action: SetToastr) {

        if (action.type === 'clear') {
            this._toastr[action.type]();

            patchState({
                type: action.type
            });
        } else {
            const timeout = action.timeout || action.timeout === 0 ? action.timeout : toastrStateDefaults.timeout;
            let tapToDismiss = true;
            let extendedTimeOut = 1000;
            if (action.tapToDismiss === false) {
                tapToDismiss = false;
                extendedTimeOut = 0;
            }
            this._toastr[action.type.toString()](action.message, action.title, {
                    timeOut: timeout * 1000,
                    extendedTimeOut: extendedTimeOut,
                    tapToDismiss: tapToDismiss
                }
            );
            patchState({
                type: action.type,
                title: action.title,
                message: action.message,
                timeout: timeout
            });
        }

        // switch (action.type) {
        //     case 'clear':
        //         this._toastr[action.type]();
        //
        //         patchState({
        //             type: action.type
        //         });
        //         break;
        //
        //     default:
        //         const timeout = action.timeout || action.timeout === 0 ? action.timeout : toastrStateDefaults.timeout;
        //         let tapToDismiss = true;
        //         let extendedTimeOut = 1000;
        //         if (action.tapToDismiss === false) {
        //             tapToDismiss = false;
        //             extendedTimeOut = 0;
        //         }
        //         this._toastr[action.type](action.message, action.title, {
        //                 timeOut: timeout * 1000,
        //                 extendedTimeOut: extendedTimeOut,
        //                 tapToDismiss: tapToDismiss
        //             }
        //         );
        //         patchState({
        //             type: action.type,
        //             title: action.title,
        //             message: action.message,
        //             timeout: timeout
        //         });
        //         break;
        // }

    }
}
