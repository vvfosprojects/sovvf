import { Action, State, StateContext } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { SetToastr, ShowToastr } from '../../actions/toastr/toastr.actions';
import { Injectable, NgZone } from '@angular/core';

export interface ToastrStateModel {
    type: string;
    title?: string;
    message?: string;
    timeout?: number;
    positionClass?: string;
}

export const toastrStateDefaults: ToastrStateModel = {
    type: null,
    title: null,
    message: null,
    timeout: 5,
    positionClass: ''
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
            const innerWidth = window.innerWidth;
            let positionClass;
            if (innerWidth && innerWidth > 3700) {
              positionClass = 'toast-postion-left';
            } else {
              positionClass = 'toast-postion-center';
            }
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
                        tapToDismiss,
                        positionClass,
                    }
                );
            });
            patchState({
                type: action.type,
                title: action.title,
                message: action.message,
                timeout,
                positionClass
            });
        }
    }
}
