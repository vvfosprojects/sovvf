import { Action, NgxsOnChanges, NgxsSimpleChange, Selector, State, StateContext, Store } from '@ngxs/store';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignalROfflineComponent } from '../signal-r-offline/signal-r-offline.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { AuthState } from '../../../features/auth/store/auth.state';

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

@State<SignalRStateModel>({
    name: 'signalR',
    defaults: SignalRStateDefaults
})

export class SignalRState implements NgxsOnChanges {

    private modalInstance: NgbModalRef;

    @Selector()
    static connectionIdSignalR(state: SignalRStateModel): string {
        return state.connectionId;
    }

    @Selector()
    static codiceSedeSignalR(state: SignalRStateModel): string {
        return state.codiciSede ? state.codiciSede.join() : '';
    }

    @Selector()
    static idUtenteSignalR(state: SignalRStateModel): string {
        return state.idUtente;
    }

    constructor(private signalR: SignalRService, private store: Store,
                private modalService: NgbModal) {
    }

    ngxsOnChanges(change: NgxsSimpleChange) {
        const currentValue = change.currentValue;
        const previousValue = change.previousValue;
        if (!currentValue.disconnected && currentValue.reconnected && previousValue.reconnected) {
            this.modalInstance.close();
            this.store.dispatch(new Navigate([`/${RoutesPath.Logged}`]));
        } else if (currentValue.disconnected) {
            this.openModal();
        }
    }

    @Action(SignalRHubConnesso)
    signalRConnesso({ getState, patchState, dispatch }: StateContext<SignalRStateModel>) {
        const state = getState();
        const reconnected = state.disconnected ? true : null;
        if (reconnected) {
            dispatch([
                new ShowToastr(ToastrType.Clear),
                new ShowToastr(ToastrType.Success, 'signalR', 'Sei di nuovo online!', 5, null, true)
            ]);
            if (state.codiciSede && state.codiciSede.length > 0) {
                const utente = this.store.selectSnapshot(AuthState.currentUser);
                this.signalR.addToGroup(new SignalRNotification(
                    state.codiciSede,
                    utente.id,
                    `${utente.nome} ${utente.cognome}`
                ));
            }
        }
        patchState({
            connected: true,
            reconnected: reconnected,
            disconnected: false
        });
    }

    @Action(SignalRHubDisconnesso)
    signalRDisconnesso({ getState, patchState, dispatch }: StateContext<SignalRStateModel>) {
        const state = getState();
        const disconnected = state.connected ? true : null;
        if (disconnected) {
            dispatch(new ShowToastr(ToastrType.Error, 'signalR', 'Sei disconnesso!', 0, false, true));
        }
        patchState({
            connected: SignalRStateDefaults.connected,
            reconnected: false,
            disconnected: disconnected,
            connectionId: null,
        });
    }

    @Action(SetConnectionId)
    setConnectionId({ patchState }: StateContext<SignalRStateModel>, action: SetConnectionId) {
        patchState({ connectionId: action.connectionId });
    }

    @Action(SetCodiceSede)
    setCodiceSede({ getState, patchState, dispatch }: StateContext<SignalRStateModel>, { codiciSede }: SetCodiceSede) {
        const codiciSedeAttuali = getState().codiciSede;
        const codiciSedeAdd = difference(codiciSede, codiciSedeAttuali);
        const codiciSedeRemove = difference(codiciSedeAttuali, codiciSede);
        console.log('SetCodiceSede', JSON.stringify({
            codiciSede, codiciSedeAttuali, codiciSedeAdd, codiciSedeRemove
        }));
        patchState({ codiciSede });
        dispatch([new ClearUtenteSignalR(codiciSedeRemove), new SetUtenteSignalR(codiciSedeAdd)]);
    }

    @Action(ClearCodiceSede)
    clearCodiceSede({ patchState }: StateContext<SignalRStateModel>) {
        patchState({ codiciSede: SignalRStateDefaults.codiciSede });
    }

    @Action(SetUtenteSignalR)
    setUtenteSignalR({ dispatch }: StateContext<SignalRStateModel>, { codiciSede }: SetUtenteSignalR) {
        const utente = this.store.selectSnapshot(AuthState.currentUser);
        dispatch(new SetIdUtente(utente.id));
        if (codiciSede && codiciSede.length > 0) {
            this.signalR.addToGroup(new SignalRNotification(
                codiciSede,
                utente.id,
                `${utente.nome} ${utente.cognome}`
            ));
        }
    }

    @Action(ClearUtenteSignalR)
    clearUtenteSignalR({}: StateContext<SignalRStateModel>, { codiciSede }: ClearUtenteSignalR) {
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
    logoffUtenteSignalR({ getState, dispatch }: StateContext<SignalRStateModel>, { utente }: LogoffUtenteSignalR) {
        const codiciSede = getState().codiciSede;
        this.signalR.removeToGroup(new SignalRNotification(
            codiciSede,
            utente.id,
            `${utente.nome} ${utente.cognome}`
            )
        );
        dispatch(new ClearCodiceSede());
    }

    @Action(SetIdUtente)
    setIdUtente({ patchState }: StateContext<SignalRStateModel>, action: SetIdUtente) {
        patchState({ idUtente: action.idUtente });
    }

    @Action(ClearIdUtente)
    clearIdUtente({ patchState }: StateContext<SignalRStateModel>) {
        patchState({ idUtente: SignalRStateDefaults.idUtente });
    }

    openModal(): void {
        this.modalService.hasOpenModals() && this.modalService.dismissAll();
        this.modalInstance = this.modalService.open(SignalROfflineComponent, {
            centered: true,
            size: 'lg',
            backdropClass: 'backdrop-custom-black',
            backdrop: 'static',
            keyboard: false
        });
        this.modalInstance.result.then();
    }

}
