import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SignalRHubConnesso, SignalRHubDisconnesso } from './signalR.actions';

export interface SignalRStateModel {
    connected: boolean;
}

export const SignalRStateDefaults: SignalRStateModel = {
    connected: false,
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

    @Action(SignalRHubConnesso)
    signalRConnesso({ patchState }: StateContext<SignalRStateModel>) {
        patchState({
            connected: true
        });
    }

    @Action(SignalRHubDisconnesso)
    signalRDisconnesso({ patchState }: StateContext<SignalRStateModel>) {
        patchState({
            connected: SignalRStateDefaults.connected
        });
    }

}
