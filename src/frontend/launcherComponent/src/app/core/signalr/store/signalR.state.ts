import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetConnectionId, SignalRHubConnesso, SignalRHubDisconnesso } from './signalR.actions';
import { ShowToastr } from '../../../shared/store/actions/toastr/toastr.actions';

export interface SignalRStateModel {
    connected: boolean;
    reconnected: boolean;
    disconnected: boolean;
    connectionId: string;
}

export const SignalRStateDefaults: SignalRStateModel = {
    connected: false,
    reconnected: null,
    disconnected: null,
    connectionId: null
};

@State<SignalRStateModel>({
    name: 'signalR',
    defaults: SignalRStateDefaults
})

export class SignalRState {

    @Selector()
    static statusSignalR(state: SignalRStateModel): boolean {
        return state.connected;
    }

    @Selector()
    static connectionIdSignalR(state: SignalRStateModel): string {
        return state.connectionId;
    }

    @Action(SignalRHubConnesso)
    signalRConnesso({ getState, patchState, dispatch }: StateContext<SignalRStateModel>) {
        const state = getState();
        const reconnected = state.disconnected ? true : null;
        if (reconnected) {
            dispatch(new ShowToastr('clear'));
            dispatch(new ShowToastr('success', 'signalR', 'Sei di nuovo online!', 5));
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
            dispatch(new ShowToastr('error', 'signalR', 'Sei disconnesso!', 0, false));
        }
        patchState({
            connected: SignalRStateDefaults.connected,
            reconnected: SignalRStateDefaults.reconnected,
            disconnected: disconnected
        });
    }

    @Action(SetConnectionId)
    setConnectionId({ patchState }: StateContext<SignalRStateModel>, action: SetConnectionId) {
        console.log(action.connectionId);
        patchState({
            connectionId: action.connectionId
        });
    }

}
