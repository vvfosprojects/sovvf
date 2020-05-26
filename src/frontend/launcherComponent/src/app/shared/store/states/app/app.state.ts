import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ReloadApp, SetVistaSedi, SetTimeSync, ClearVistaSedi } from '../../actions/app/app.actions';
import { SetCodiceSede } from '../../../../core/signalr/store/signalR.actions';
import { SignalRState } from '../../../../core/signalr/store/signalR.state';

export interface AppStateModel {
    appIsLoaded: boolean;
    vistaSedi: string[];
    offsetTimeSync: number;
}

export const appStateDefaults: AppStateModel = {
    appIsLoaded: true,
    vistaSedi: null,
    offsetTimeSync: 0
};

@State<AppStateModel>({
    name: 'appState',
    defaults: appStateDefaults
})
export class AppState {

    @Selector([SignalRState])
    static appIsLoaded(state: AppStateModel) {
        return state.appIsLoaded && SignalRState.statusSignalR;
    }

    @Selector()
    static offsetTimeSync(state: AppStateModel) {
        return state.offsetTimeSync;
    }

    @Selector()
    static vistaSedi(state: AppStateModel) {
        return state.vistaSedi;
    }

    @Action(ReloadApp)
    reloadApp({ getState, patchState }: StateContext<AppStateModel>) {
        const appLoaded = getState().appIsLoaded;
        if (appLoaded) {
            reload();
            setTimeout(() => {
                reload();
            }, 0);
        }

        function reload() {
            patchState({
                appIsLoaded: !getState().appIsLoaded
            });
        }
    }

    @Action(SetVistaSedi)
    setVistaSedi({ patchState, dispatch }: StateContext<AppStateModel>, { vistaSedi }: SetVistaSedi) {
        patchState({ vistaSedi });
        dispatch(new SetCodiceSede(vistaSedi));
    }

    @Action(ClearVistaSedi)
    clearVistaSedi({ patchState }: StateContext<AppStateModel>) {
        patchState({ vistaSedi: appStateDefaults.vistaSedi });
    }

    @Action(SetTimeSync)
    setTimeSync({ patchState }: StateContext<AppStateModel>, action: SetTimeSync) {
        patchState({
            offsetTimeSync: new Date(action.time).getTime() - new Date().getTime()
        });
    }
}
