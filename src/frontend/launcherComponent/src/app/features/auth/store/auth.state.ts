import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    CasLogin,
    CasLogout,
    CasResponse,
    ClearAuth, ClearCurrentUser,
    GetAuth, Logout,
    RecoveryUrl,
    SetCurrentJwt,
    SetCurrentTicket,
    SetCurrentUser,
    SetLogged, UpdateCurrentUser
} from './auth.actions';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LSNAME } from '../../../core/settings/config';
import { Utente } from '../../../shared/model/utente.model';
import { Navigate } from '@ngxs/router-plugin';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { ClearVistaSedi, SetVistaSedi } from '../../../shared/store/actions/app/app.actions';
import { ClearIdUtente, LogoffUtenteSignalR } from '../../../core/signalr/store/signalR.actions';
import { ClearRuoliUtenteLoggato } from '../../../shared/store/actions/ruoli/ruoli.actions';
import { ClearViewState } from '../../home/store/actions/view/view.actions';
import { ClearRichieste } from '../../home/store/actions/richieste/richieste.actions';

export interface AuthStateModel {
    currentJwt: string;
    currentTicket: string;
    currentUser: Utente;
    logged: boolean;
    loggedCas: boolean;
}

export const AuthStateDefaults: AuthStateModel = {
    currentJwt: null,
    currentTicket: null,
    currentUser: null,
    logged: false,
    loggedCas: false
};

@Injectable()
@State<AuthStateModel>({
    name: 'auth',
    defaults: AuthStateDefaults
})
export class AuthState {

    constructor(private authService: AuthenticationService) {
    }

    @Selector()
    static currentJwt(state: AuthStateModel) {
        return state.currentJwt;
    }

    @Selector()
    static currentUser(state: AuthStateModel) {
        return state.currentUser;
    }

    @Selector()
    static logged(state: AuthStateModel) {
        return state.logged;
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
    getAuth({ getState, dispatch, patchState }: StateContext<AuthStateModel>) {
        const state = getState();
        if (state.currentTicket) {
            console.log('getAuth');
            this.authService.ticketLogin(state.currentTicket, environment.casUrl.serviceName).subscribe(result => {
                    if (result.token) {
                        patchState({ loggedCas: true });
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
            patchState({
                currentJwt: action.currentJwt,
                currentTicket: null
            });
            dispatch([ new SetLogged() ]);
        }
    }

    @Action(SetCurrentUser)
    setCurrentUser({ patchState, dispatch }: StateContext<AuthStateModel>, { currentUser }: SetCurrentUser) {
        sessionStorage.setItem(LSNAME.currentUser, JSON.stringify(currentUser));
        patchState({ currentUser });
        dispatch(new SetVistaSedi([ currentUser.sede.codice ]));
    }

    @Action(UpdateCurrentUser)
    updateCurrentUser({ patchState, dispatch }: StateContext<AuthStateModel>, action: UpdateCurrentUser) {
        patchState({
            currentUser: action.utente
        });
        if (action.options.localStorage) {
            sessionStorage.setItem(LSNAME.currentUser, JSON.stringify(action.utente));
        }
    }

    @Action(SetLogged)
    setLogged({ patchState }: StateContext<AuthStateModel>) {
        patchState({
            logged: true
        });
    }

    @Action(Logout)
    logout({ getState, dispatch }: StateContext<AuthStateModel>, { url }: Logout) {
        const state = getState();
        if (state.currentUser) {
            dispatch(new ClearCurrentUser(url !== '/home'));
        }
        if (state.loggedCas) {
            dispatch([ new CasLogout() ]);
        }
    }

    @Action(RecoveryUrl)
    recoveryUrl({ dispatch }: StateContext<AuthStateModel>) {
        const currentUrl = JSON.parse(localStorage.getItem(LSNAME.redirectUrl));
        console.log('RecoveryUrl', currentUrl);
        if (currentUrl) {
            localStorage.removeItem(LSNAME.redirectUrl);
            dispatch(new Navigate([ currentUrl ]));
        } else {
            dispatch(new Navigate([ '/' + RoutesPath.Home ]));
        }
    }

    @Action(CasLogin)
    casLogin({ getState }: StateContext<AuthStateModel>) {
        const state = getState();
        if (!state.logged && !state.currentUser) {
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
        // dispatch(new ClearLogin());
        this.removeStorage();
        patchState(AuthStateDefaults);
    }

    // Todo rivedere.
    @Action(ClearCurrentUser)
    clearCurrentUser({ getState, patchState, dispatch }: StateContext<AuthStateModel>, action: ClearCurrentUser) {
        const state = getState();
        if (action.skipDeleteAll) {
            if (state.currentUser) {
                // Clear SignalR Data
                dispatch([
                    new LogoffUtenteSignalR(state.currentUser),
                    new ClearVistaSedi(),
                    new ClearIdUtente()
                ]);
            }
            this.removeStorage();
            dispatch([
                // Current Roles Session Storage
                new ClearRuoliUtenteLoggato(),
                new ClearViewState(),
                new ClearRichieste(),
                new Navigate(['/login'])
            ]);
            // Clear User Data
            patchState({
                currentUser: null
            });
        } else {
            this.authService.clearUserData().subscribe((res: any) => {
                if (state.currentUser) {
                    // Clear SignalR Data
                    dispatch([
                        new LogoffUtenteSignalR(state.currentUser),
                        new ClearVistaSedi(),
                        new ClearIdUtente()
                    ]);
                }
                this.removeStorage();
                dispatch([
                    // Current Roles Session Storage
                    new ClearRuoliUtenteLoggato(),
                    new ClearViewState(),
                    new ClearRichieste(),
                    new Navigate(['/login'])
                ]);
                // Clear User Data
                patchState({
                    currentUser: null
                });
            });
        }
    }

    removeStorage(): void {
        sessionStorage.removeItem(LSNAME.token);
        sessionStorage.removeItem(LSNAME.currentUser);
        localStorage.removeItem(LSNAME.redirectUrl);
    }

}
