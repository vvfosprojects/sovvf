import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetCodiceSede, SetConnectionId, SetIdUtente, SignalRHubConnesso, SignalRHubDisconnesso } from './signalR.actions';
import { ShowToastr } from '../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../shared/enum/toastr';

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
        patchState({
            connectionId: action.connectionId
        });
    }

    @Action(SetCodiceSede)
    setCodiceSede({ patchState }: StateContext<SignalRStateModel>, action: SetCodiceSede) {
        patchState({
            codiceSede: action.codiceSede
        });
    }

    @Action(SetIdUtente)
    setIdUtente({ patchState }: StateContext<SignalRStateModel>, action: SetIdUtente) {
        patchState({
            idUtente: action.idUtente
        });
    }
}
