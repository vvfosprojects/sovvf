import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    CasLogin,
    CasLogout,
    CasResponse,
    ClearAuth, GetAuth,
    SetCurrentJwt,
    SetCurrentTicket,
    SetCurrentUser
} from './auth.actions';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ClearLogin, SetLogged, SetReturnUrl } from './login.actions';
import { LSNAME } from '../../../core/settings/config';
import { AuthService } from '../../../core/service/auth-service/auth.service';
import { Utente } from '../../../shared/model/utente.model';

export interface AuthStateModel {
    currentJwt: string;
    currentTicket: string;
    currentUser: Utente;
}

export const AuthStateDefaults: AuthStateModel = {
    currentJwt: null,
    currentTicket: null,
    currentUser: null
};

@Injectable()
@State<AuthStateModel>({
    name: 'auth',
    defaults: AuthStateDefaults
})
export class AuthState {

    constructor(private authService: AuthService) {
    }

    @Selector()
    static currentJwt(state: AuthStateModel) {
        return state.currentJwt;
    }

    @Selector()
    static currentUser(state: AuthStateModel) {
        return state.currentUser;
    }

    @Action(SetCurrentTicket)
    setCurrentTicket({ patchState, dispatch }: StateContext<AuthStateModel>, action: SetCurrentTicket) {
        if (action.currentTicket) {
            patchState({
                currentTicket: action.currentTicket
            });
            dispatch(new GetAuth());
        }
    }

    @Action(GetAuth)
    getAuth({ getState, dispatch }: StateContext<AuthStateModel>) {
        const state = getState();
        if (state.currentTicket) {
            console.log('getAuth');
            this.authService.ticketLogin(state.currentTicket, environment.casUrl.serviceName).subscribe(result => {
                    if (result.token) {
                        dispatch([ new SetCurrentJwt(result.token), new SetCurrentUser(result) ]);
                    }
                }
            );
        }
    }

    @Action(SetCurrentJwt)
    setCurrentJwt({ patchState, dispatch }: StateContext<AuthStateModel>, action: SetCurrentJwt) {
        if (action.currentJwt) {
            sessionStorage.setItem(LSNAME.token, JSON.stringify(action.currentJwt));
            const currentUrl = JSON.parse(localStorage.getItem(LSNAME.redirectUrl));
            console.log(currentUrl);
            patchState({
                currentJwt: action.currentJwt,
                currentTicket: null
            });
            dispatch([ new SetReturnUrl(currentUrl), new SetLogged() ]);
        }
    }

    @Action(SetCurrentUser)
    setCurrentUser({ patchState }: StateContext<AuthStateModel>, { currentUser }: SetCurrentUser) {
        sessionStorage.setItem(LSNAME.currentUser, JSON.stringify(currentUser));
        patchState({ currentUser });
    }

    @Action(CasLogin)
    casLogin({ getState }: StateContext<AuthStateModel>) {
        const state = getState();
        if (!state.currentUser) {
            window.location.href = `${environment.casUrl.linkLogin}${environment.casUrl.serviceName}auth`;
        }
    }

    @Action(CasResponse)
    casResponse({ getState, dispatch }: StateContext<AuthStateModel>, action: CasResponse) {
        console.log('CasResponse', action.ticket);
        if (!action.ticket) {
            dispatch(new CasLogin());
        } else {
            dispatch([ new SetCurrentTicket(action.ticket) ]);
        }
    }

    @Action(CasLogout)
    casLogout() {
        window.location.href = `${environment.casUrl.linkLogout}${environment.casUrl.serviceName}caslogout`;
    }

    @Action(ClearAuth)
    clearAuth({ dispatch, patchState }: StateContext<AuthStateModel>) {
        dispatch(new ClearLogin());
        patchState(AuthStateDefaults);
    }

}
