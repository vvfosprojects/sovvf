import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
    SetCodiceSede,
    SetConnectionId,
    SetIdUtente,
    SetUtenteSignalR,
    ClearUtenteSignalR,
    SignalRHubConnesso,
    SignalRHubDisconnesso, ClearIdUtente, ClearCodiceSede
} from './signalR.actions';
import { ShowToastr } from '../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../shared/enum/toastr';
import { SignalRNotification } from '../model/signalr-notification.model';
import { SignalRService } from '../signalR.service';
import { UtenteState } from '../../../features/navbar/store/states/operatore/utente.state';

export interface SignalRStateModel {
    connected: boolean;
    reconnected: boolean;
    disconnected: boolean;
    connectionId: string;
    codiceSede: string;
    idUtente: string;
}

export const SignalRStateDefaults: SignalRStateModel = {
    connected: false,
    reconnected: null,
    disconnected: null,
    connectionId: null,
    codiceSede: null,
    idUtente: null
};

@State<SignalRStateModel>({
    name: 'signalR',
    defaults: SignalRStateDefaults
})

export class SignalRState {

    @Selector()
    static statusSignalR(state: SignalRStateModel): boolean {
        return state.connected && !!state.connectionId;
    }

    @Selector()
    static connectionIdSignalR(state: SignalRStateModel): string {
        return state.connectionId;
    }

    @Selector()
    static codiceSedeSignalR(state: SignalRStateModel): string {
        return state.codiceSede;
    }

    @Selector()
    static idUtenteSignalR(state: SignalRStateModel): string {
        return state.idUtente;
    }

    constructor(private signalR: SignalRService, private store: Store) {
    }

    @Action(SignalRHubConnesso)
    signalRConnesso({ getState, patchState, dispatch }: StateContext<SignalRStateModel>) {
        const state = getState();
        const reconnected = state.disconnected ? true : null;
        if (reconnected) {
            dispatch(new ShowToastr(ToastrType.Clear));
            dispatch(new ShowToastr(ToastrType.Success, 'signalR', 'Sei di nuovo online!', 5));
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
            dispatch(new ShowToastr(ToastrType.Error, 'signalR', 'Sei disconnesso!', 0, false));
        }
        patchState({
            connected: SignalRStateDefaults.connected,
            reconnected: SignalRStateDefaults.reconnected,
            disconnected: disconnected,
            connectionId: null,
        });
    }

    @Action(SetConnectionId)
    setConnectionId({ patchState }: StateContext<SignalRStateModel>, action: SetConnectionId) {
        patchState({ connectionId: action.connectionId });
    }

    @Action(SetCodiceSede)
    setCodiceSede({ patchState, dispatch }: StateContext<SignalRStateModel>, action: SetCodiceSede) {
        patchState({ codiceSede: action.codiceSede });
        dispatch(new SetUtenteSignalR());
    }

    @Action(ClearCodiceSede)
    clearCodiceSede({ patchState }: StateContext<SignalRStateModel>) {
        patchState({ codiceSede: SignalRStateDefaults.codiceSede });
    }

    @Action(SetUtenteSignalR)
    setUtenteSignalR({ getState, dispatch }: StateContext<SignalRStateModel>) {
        const utente = this.store.selectSnapshot(UtenteState.utente);
        const codiciSede = getState().codiceSede.split(',');
        this.signalR.addToGroup(new SignalRNotification(
            codiciSede,
            utente.id,
            `${utente.nome} ${utente.cognome}`
        ));
        dispatch(new SetIdUtente(utente.id));
    }

    @Action(ClearUtenteSignalR)
    clearUtenteSignalR({ getState, dispatch }: StateContext<SignalRStateModel>, { utente }: ClearUtenteSignalR) {
        let _utente;
        const codiciSede = getState().codiceSede.split(',');
        if (!utente) {
            _utente = this.store.selectSnapshot(UtenteState.utente);
        } else {
            _utente = utente;
        }
        this.signalR.removeToGroup(new SignalRNotification(
            codiciSede,
            _utente.id,
            `${_utente.nome} ${_utente.cognome}`
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

}
