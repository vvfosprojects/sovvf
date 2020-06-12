import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    Allowed,
    ClearLogin,
    Login,
    Logout,
    SetErrorMessage,
    SetLogged,
    SetReturnUrl,
    Unauthorized
} from './login.actions';
import { CasLogin, CasLogout, ClearAuth } from './auth.actions';
import { Injectable } from '@angular/core';
import { LSNAME } from '../../../core/settings/config';
import { Navigate } from '@ngxs/router-plugin';

export interface LoginStateModel {
    returnUrl: string;
    errorMessage: string;
    logged: boolean;
}

export const LoginStateDefaults: LoginStateModel = {
    returnUrl: '/',
    errorMessage: null,
    logged: false
};

@Injectable()
@State<LoginStateModel>({
    name: 'login',
    defaults: LoginStateDefaults
})
export class LoginState {

    @Selector()
    static errorMessage(state: LoginStateModel) {
        return state.errorMessage;
    }

    @Selector()
    static logged(state: LoginStateModel) {
        return state.logged;
    }

    @Action(SetLogged)
    setLogged({ patchState, dispatch }: StateContext<LoginStateModel>) {
        patchState({
            logged: true
        });
        dispatch(new Allowed());
    }

    @Action(SetErrorMessage)
    setErrorMessage({ patchState }: StateContext<LoginStateModel>, action: SetErrorMessage) {
        if (action.errorMessage) {
            patchState({
                errorMessage: action.errorMessage
            });
        }
    }

    @Action(SetReturnUrl)
    setReturnUrl({ patchState }: StateContext<LoginStateModel>, { returnUrl }: SetReturnUrl) {
        if (returnUrl) {
            localStorage.setItem(LSNAME.redirectUrl, JSON.stringify(returnUrl));
            patchState({ returnUrl });
        }
    }

    @Action(Unauthorized)
    unauthorized({ dispatch }: StateContext<LoginStateModel>) {
        dispatch([ new ClearAuth(), new CasLogin() ]);
    }

    @Action(Allowed)
    allowed({ getState, dispatch }: StateContext<LoginStateModel>) {
        dispatch([ new Navigate([ getState().returnUrl ]) ]);
    }

    @Action(Login)
    login({ getState, dispatch }: StateContext<LoginStateModel>) {
        const state = getState();
        if (!state.logged) {
            dispatch(new CasLogin());
        } else {
            dispatch(new Allowed());
        }
    }

    @Action(Logout)
    logout({ dispatch }: StateContext<LoginStateModel>) {
        this.removeStorage();
        dispatch([ new CasLogout() ]);
    }

    @Action(ClearLogin)
    clearLogin({ patchState }: StateContext<LoginStateModel>) {
        patchState(LoginStateDefaults);
    }

    removeStorage(): void {
        sessionStorage.removeItem(LSNAME.token);
        sessionStorage.removeItem(LSNAME.currentUser);
        localStorage.removeItem(LSNAME.redirectUrl);
    }

}
