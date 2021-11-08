import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    CasLogin,
    CasLogout,
    CasResponse,
    ClearAuth,
    ClearCurrentUser,
    ClearDataUser,
    GetAuth,
    Logout,
    RecoveryUrl,
    SetCurrentJwt,
    SetCurrentPswEsri,
    SetCurrentTicket,
    SetCurrentUser,
    SetCurrentUserEsri,
    SetLogged,
    SetLoggedCas,
    UpdateCurrentUser,
    UpdateRuoliPersonali
} from './auth.actions';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LSNAME } from '../../../core/settings/config';
import { Utente } from '../../../shared/model/utente.model';
import { Navigate } from '@ngxs/router-plugin';
import { AuthService } from '../../../core/auth/auth.service';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { ClearVistaSedi, SetVistaSedi } from '../../../shared/store/actions/app/app.actions';
import { ClearIdUtente, LogoffUtenteSignalR } from '../../../core/signalr/store/signalR.actions';
import { ClearRuoliUtenteLoggato, UpdateRuoliUtenteLoggato } from '../../../shared/store/actions/ruoli/ruoli.actions';
import { ClearViewState } from '../../home/store/actions/view/view.actions';
import { ClearRichieste } from '../../home/store/actions/richieste/richieste.actions';
import { _isAdministrator } from '../../../shared/helper/function-generiche';
import { GestioneUtentiStateModel } from '../../gestione-utenti/store/states/gestione-utenti/gestione-utenti.state';
import { GestioneUtentiService } from '../../../core/service/gestione-utenti-service/gestione-utenti.service';

export interface AuthStateModel {
    currentJwt: string;
    currentPswEsri: string;
    currentUserEsri: string;
    currentTicket: string;
    currentUser: Utente;
    logged: boolean;
    loggedCas: boolean;
}

export const AuthStateDefaults: AuthStateModel = {
    currentJwt: null,
    currentPswEsri: null,
    currentUserEsri: null,
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

    constructor(private authService: AuthService,
                private gestioneUtentiService: GestioneUtentiService) {
    }

    @Selector()
    static currentJwt(state: AuthStateModel): string {
        return state.currentJwt;
    }

    @Selector()
    static currentPswEsri(state: AuthStateModel): string {
        return state.currentPswEsri;
    }
    @Selector()
    static currentUserEsri(state: AuthStateModel): string {
        return state.currentUserEsri;
    }

    @Selector()
    static currentUser(state: AuthStateModel): Utente {
        return state.currentUser;
    }

    @Selector()
    static logged(state: AuthStateModel): boolean {
        return state.logged;
    }

    @Action(SetCurrentTicket)
    setCurrentTicket({ patchState, dispatch }: StateContext<AuthStateModel>, action: SetCurrentTicket): void {
        if (action.currentTicket) {
            patchState({
                currentTicket: action.currentTicket
            });
            dispatch(new GetAuth());
        }
    }

    @Action(GetAuth)
    getAuth({ getState, dispatch }: StateContext<AuthStateModel>): void {
        const state = getState();
        if (state.currentTicket) {
            console.log('getAuth');
            this.authService.ticketLogin(state.currentTicket, `${environment.casUrl.serviceName}auth`).subscribe(result => {
                    if (result.token) {
                        dispatch([
                            new SetLoggedCas(),
                            new SetCurrentJwt(result.token),
                            new SetCurrentUser(result),
                            new RecoveryUrl()
                        ]);
                    }
                }, () => {
                    dispatch(new Navigate([`/${RoutesPath.UtenteNonAbilitato}`]));
                }
            );
        }
    }

    @Action(SetCurrentJwt)
    setCurrentJwt({ patchState, dispatch }: StateContext<AuthStateModel>, action: SetCurrentJwt): void {
        if (action.currentJwt) {
            sessionStorage.setItem(LSNAME.token, JSON.stringify(action.currentJwt));
            patchState({
                currentJwt: action.currentJwt,
                currentTicket: null
            });
            dispatch([new SetLogged()]);
        }
    }

    @Action(SetCurrentPswEsri)
    setCurrentPswEsri({ patchState, dispatch }: StateContext<AuthStateModel>, action: SetCurrentPswEsri): void {
        if (action.psw) {
            patchState({
                currentPswEsri: action.psw
            });
        }
    }

    @Action(SetCurrentUserEsri)
    setCurrentUserEsri({ patchState, dispatch }: StateContext<AuthStateModel>, action: SetCurrentUserEsri): void {
        if (action.user) {
            patchState({
                currentUserEsri: action.user
            });
        }
    }

    @Action(SetCurrentUser)
    setCurrentUser({ patchState, dispatch }: StateContext<AuthStateModel>, { currentUser }: SetCurrentUser): void {
        sessionStorage.setItem(LSNAME.currentUser, JSON.stringify(currentUser));
        patchState({ currentUser });
        let cS: any = sessionStorage.getItem(LSNAME.cacheSedi);
        if (cS) {
            cS = JSON.parse(cS);
        }
        let codice = [currentUser.sede.codice];
        if (cS) {
            codice = cS;
        }
        dispatch(new SetVistaSedi(codice));
    }

    @Action(UpdateCurrentUser)
    updateCurrentUser({ patchState, dispatch }: StateContext<AuthStateModel>, action: UpdateCurrentUser): void {
        patchState({
            currentUser: action.utente
        });
        if (action.options.localStorage) {
            sessionStorage.setItem(LSNAME.currentUser, JSON.stringify(action.utente));
        }
    }

    @Action(UpdateRuoliPersonali)
    updateRuoliPersonali({ getState, dispatch }: StateContext<GestioneUtentiStateModel>, action: UpdateRuoliPersonali): void {
        this.gestioneUtentiService.getUtente(action.idUtente).subscribe(objUtente => {
                const utente = objUtente.detUtente ? objUtente.detUtente : null;
                if (utente && utente.ruoli) {
                    dispatch([
                        new UpdateCurrentUser(utente, { localStorage: true }),
                        new UpdateRuoliUtenteLoggato(utente.ruoli)
                    ]);
                    if (!_isAdministrator(utente)) {
                        dispatch(new Navigate(['/home']));
                    }
                }
            }
        );
    }

    @Action(SetLogged)
    setLogged({ patchState }: StateContext<AuthStateModel>): void {
        sessionStorage.setItem(LSNAME.casLogin, JSON.stringify(true));
        patchState({
            logged: true
        });
    }

    @Action(SetLoggedCas)
    setLoggedCas({ patchState }: StateContext<AuthStateModel>): void {
        patchState({
            loggedCas: true
        });
    }

    @Action(Logout)
    logout({ getState, dispatch }: StateContext<AuthStateModel>, { url }: Logout): void {
        const state = getState();
        if (state.loggedCas) {
            dispatch(new CasLogout());
        } else {
            dispatch(new ClearCurrentUser(url !== '/home'));
        }
    }

    @Action(RecoveryUrl)
    recoveryUrl({ dispatch }: StateContext<AuthStateModel>): void {
        const currentUrl = JSON.parse(localStorage.getItem(LSNAME.redirectUrl));
        console.log('RecoveryUrl', currentUrl);
        if (currentUrl) {
            localStorage.removeItem(LSNAME.redirectUrl);
            dispatch(new Navigate([currentUrl]));
        } else {
            dispatch(new Navigate(['/' + RoutesPath.Home]));
        }
    }

    @Action(CasLogin)
    casLogin({ getState, dispatch }: StateContext<AuthStateModel>): void {
        const state = getState();
        if (!state.logged && !state.currentUser) {
            window.location.href = `${environment.casUrl.linkLogin}${environment.casUrl.serviceName}auth`;
        } else {
            dispatch(new RecoveryUrl());
        }
    }

    @Action(CasResponse)
    casResponse({ getState, dispatch }: StateContext<AuthStateModel>, action: CasResponse): void {
        console.log('CasResponse', action.ticket);
        if (!action.ticket) {
            dispatch(new CasLogin());
        } else {
            dispatch([new SetCurrentTicket(action.ticket)]);
        }
    }

    @Action(CasLogout)
    casLogout(): void {
        window.location.href = `${environment.casUrl.linkLogout}${environment.casUrl.serviceName}caslogout`;
    }

    @Action(ClearAuth)
    clearAuth({ dispatch, patchState }: StateContext<AuthStateModel>): void {
        patchState(AuthStateDefaults);
        this.removeStorage();
        dispatch(new Navigate(['/login']));
    }

    @Action(ClearDataUser)
    clearDataUser({ getState, dispatch }: StateContext<AuthStateModel>): void {
        const state = getState();
        if (state.currentUser) {
            dispatch([
                new LogoffUtenteSignalR(state.currentUser),
                new ClearVistaSedi(),
                new ClearIdUtente()
            ]);
        }
        dispatch([
            new ClearRuoliUtenteLoggato(),
            new ClearViewState(),
            new ClearRichieste(),
            new ClearAuth()
        ]);
    }

    @Action(ClearCurrentUser)
    clearCurrentUser({ getState, patchState, dispatch }: StateContext<AuthStateModel>, action: ClearCurrentUser): void {
        const state = getState();
        if (state.logged) {
            if (action.skipDeleteAll) {
                dispatch(new ClearDataUser());
            } else {
                this.authService.clearUserData().subscribe(() => {
                    dispatch(new ClearDataUser());
                });
            }
        }
    }

    removeStorage(): void {
        sessionStorage.removeItem(LSNAME.token);
        sessionStorage.removeItem(LSNAME.currentUser);
        sessionStorage.removeItem(LSNAME.casLogin);
        localStorage.removeItem(LSNAME.redirectUrl);
        sessionStorage.removeItem(LSNAME.cacheSedi);
    }
}
