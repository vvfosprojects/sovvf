import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetAppLoaded, SetVistaSedi, SetTimeSync, ClearVistaSedi } from '../../actions/app/app.actions';
import { SetCodiceSede } from '../../../../core/signalr/store/signalR.actions';

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

    @Selector()
    static appIsLoaded(state: AppStateModel) {
        return state.appIsLoaded;
    }

    @Selector()
    static offsetTimeSync(state: AppStateModel) {
        return state.offsetTimeSync;
    }

    @Selector()
    static vistaSedi(state: AppStateModel) {
        return state.vistaSedi;
    }

    @Action(SetAppLoaded)
    setAppLoaded({ getState, patchState }: StateContext<AppStateModel>) {
        const appLoaded = getState().appIsLoaded;
        if (appLoaded) {
            reload();
            setTimeout(() => {
                reload();
            }, 1);
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
        dispatch(new SetCodiceSede(vistaSedi.join()));
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
