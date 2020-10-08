import { Action, State, StateContext } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { SetToastr, ShowToastr } from '../../actions/toastr/toastr.actions';
import { Injectable, NgZone } from '@angular/core';

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

@Injectable()
@State<ToastrStateModel>({
    name: 'toastr',
    defaults: toastrStateDefaults
})
export class ToastrState {

    constructor(private toastrService: ToastrService,
                private ngZone: NgZone) {
    }

    @Action(ShowToastr)
    showToastr({ getState, dispatch }: StateContext<ToastrStateModel>, action: ShowToastr): void {
        if (action.alwaysVisible) {
            dispatch(new SetToastr(action.type, action.title, action.message, action.duration, action.tapToDismiss));
        }
    }

    @Action(SetToastr)
    setToastr({ patchState }: StateContext<ToastrStateModel>, action: SetToastr): void {
        if (action.type === 'clear') {
            this.ngZone.run(() => this.toastrService[action.type.toString()]());

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
            this.ngZone.run(() => {
                this.toastrService[action.type.toString()](action.message, action.title, {
                        timeOut: timeout * 1000,
                        extendedTimeOut,
                        tapToDismiss
                    }
                );
            });
            patchState({
                type: action.type,
                title: action.title,
                message: action.message,
                timeout
            });
        }
    }
}
