import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    SetCodiceSede,
    SetConnectionId,
    SetIdUtente,
    SetUtenteSignalR,
    ClearUtenteSignalR,
    SignalRHubConnesso,
    SignalRHubDisconnesso,
    ClearIdUtente,
    ClearCodiceSede,
    LogoffUtenteSignalR
} from './signalR.actions';
import { ShowToastr } from '../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../shared/enum/toastr';
import { SignalRNotification } from '../model/signalr-notification.model';
import { SignalRService } from '../signalR.service';
import { difference } from 'lodash';
import { AuthState } from '../../../features/auth/store/auth.state';
import { Injectable } from '@angular/core';
import { LSNAME } from '../../settings/config';

export interface SignalRStateModel {
    connected: boolean;
    reconnected: boolean;
    disconnected: boolean;
    connectionId: string;
    codiciSede: string[];
    idUtente: string;
}

export const SignalRStateDefaults: SignalRStateModel = {
    connected: false,
    reconnected: null,
    disconnected: null,
    connectionId: null,
    codiciSede: null,
    idUtente: null
};

@Injectable()
@State<SignalRStateModel>({
    name: 'signalR',
    defaults: SignalRStateDefaults
})

export class SignalRState {

    @Selector()
    static connectionIdSignalR(state: SignalRStateModel): string {
        return state.connectionId;
    }

    @Selector()
    static codiceSedeSignalR(state: SignalRStateModel): string {
        return state.codiciSede ? state.codiciSede.join() : '';
    }

    @Selector()
    static codiciSede(state: SignalRStateModel): string[] {
        return state.codiciSede;
    }

    @Selector()
    static idUtenteSignalR(state: SignalRStateModel): string {
        return state.idUtente;
    }

    constructor(private signalR: SignalRService,
                private store: Store) {
    }

    @Action(SignalRHubConnesso)
    signalRConnesso({ getState, patchState, dispatch }: StateContext<SignalRStateModel>): void {
        const state = getState();
        const reconnected = state.disconnected ? true : null;
        if (reconnected) {
            // dispatch([
            //     new ShowToastr(ToastrType.Clear),
            //     new ShowToastr(ToastrType.Success, 'signalR', 'Sei di nuovo online!', 5, null, true)
            // ]);
            if (state.codiciSede && state.codiciSede.length > 0) {
                let cS: any = sessionStorage.getItem(LSNAME.cacheSedi);
                if (cS) {
                    cS = JSON.parse(cS);
                }
                const utente = this.store.selectSnapshot(AuthState.currentUser);
                this.signalR.addToGroup(new SignalRNotification(
                    cS,
                    utente.id,
                    `${utente.nome} ${utente.cognome}`
                ));
            }
        }
        patchState({
            connected: true,
            reconnected,
            disconnected: false
        });
    }

    @Action(SignalRHubDisconnesso)
    signalRDisconnesso({ getState, patchState, dispatch }: StateContext<SignalRStateModel>): void {
        const state = getState();
        const disconnected = state.connected ? true : null;
        if (disconnected) {
            dispatch(new ShowToastr(ToastrType.Error, 'signalR', 'Sei disconnesso!', 0, false, true));
        }
        patchState({
            connected: SignalRStateDefaults.connected,
            reconnected: false,
            disconnected,
            connectionId: null,
        });
    }

    @Action(SetConnectionId)
    setConnectionId({ patchState }: StateContext<SignalRStateModel>, action: SetConnectionId): void {
        patchState({ connectionId: action.connectionId });
    }

    @Action(SetCodiceSede)
    setCodiceSede({ getState, patchState, dispatch }: StateContext<SignalRStateModel>, { codiciSede }: SetCodiceSede): void {
        let cS: any = sessionStorage.getItem(LSNAME.cacheSedi);
        if (cS) {
            cS = JSON.parse(cS);
        }
        const codiciSedeAttuali = cS ? cS : getState().codiciSede;
        const codiciSedeAdd = difference(codiciSede, codiciSedeAttuali);
        const codiciSedeRemove = difference(codiciSedeAttuali, codiciSede);
        console.log('SetCodiceSede', JSON.stringify({
            codiciSede, codiciSedeAttuali, codiciSedeAdd, codiciSedeRemove
        }));
        sessionStorage.setItem(LSNAME.cacheSedi, JSON.stringify(codiciSede));
        patchState({ codiciSede });
        dispatch([new ClearUtenteSignalR(codiciSedeRemove), new SetUtenteSignalR(codiciSedeAdd)]);
    }

    @Action(ClearCodiceSede)
    clearCodiceSede({ patchState }: StateContext<SignalRStateModel>): void {
        let cS: any = sessionStorage.getItem(LSNAME.cacheSedi);
        if (cS) {
            cS = JSON.parse(cS);
        }
        patchState({ codiciSede: cS ? cS : SignalRStateDefaults.codiciSede });
    }

    @Action(SetUtenteSignalR)
    setUtenteSignalR({ dispatch }: StateContext<SignalRStateModel>, { codiciSede }: SetUtenteSignalR): void {
        const utente = this.store.selectSnapshot(AuthState.currentUser);
        dispatch(new SetIdUtente(utente.id));
        let cS: any = sessionStorage.getItem(LSNAME.cacheSedi);
        if (cS) {
            cS = JSON.parse(cS);
        }
        codiciSede = codiciSede?.length ? codiciSede : cS;
        if (codiciSede) {
            this.signalR.addToGroup(new SignalRNotification(
                codiciSede,
                utente.id,
                `${utente.nome} ${utente.cognome}`
            ));
        }
    }

    @Action(ClearUtenteSignalR)
    clearUtenteSignalR({}: StateContext<SignalRStateModel>, { codiciSede }: ClearUtenteSignalR): void {
        if (codiciSede && codiciSede.length > 0) {
            const utente = this.store.selectSnapshot(AuthState.currentUser);
            this.signalR.removeToGroup(new SignalRNotification(
                    codiciSede,
                    utente.id,
                    `${utente.nome} ${utente.cognome}`
                )
            );
        }
    }

    @Action(LogoffUtenteSignalR)
    logoffUtenteSignalR({ getState, dispatch }: StateContext<SignalRStateModel>, { utente }: LogoffUtenteSignalR): void {
        let cS: any = sessionStorage.getItem(LSNAME.cacheSedi);
        if (cS) {
            cS = JSON.parse(cS);
        }
        // const codiciSede = getState().codiciSede;
        this.signalR.removeToGroup(
            new SignalRNotification(
                cS,
                utente.id,
                `${utente.nome} ${utente.cognome}`
            )
        );
        dispatch(new ClearCodiceSede());
    }

    @Action(SetIdUtente)
    setIdUtente({ patchState }: StateContext<SignalRStateModel>, action: SetIdUtente): void {
        patchState({ idUtente: action.idUtente });
    }

    @Action(ClearIdUtente)
    clearIdUtente({ patchState }: StateContext<SignalRStateModel>): void {
        patchState({ idUtente: SignalRStateDefaults.idUtente });
    }
}
