import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ReloadApp,
    SetVistaSedi,
    SetTimeSync,
    ClearVistaSedi,
    SetMapLoaded,
    SetGestioneUtentiLoaded
} from '../../actions/app/app.actions';
import { SetCodiceSede } from '../../../../core/signalr/store/signalR.actions';
import { SignalRState, SignalRStateModel } from '../../../../core/signalr/store/signalR.state';
import { RouterState } from '@ngxs/router-plugin';
import { RouterStateModel } from '@ngxs/router-plugin/src/router.state';

export interface AppStateModel {
    appIsLoaded: boolean;
    vistaSedi: string[];
    offsetTimeSync: number;
    mapIsLoaded: boolean;
    gestioneUtentiIsLoaded: boolean;
}

export const appStateDefaults: AppStateModel = {
    appIsLoaded: true,
    vistaSedi: null,
    offsetTimeSync: 0,
    mapIsLoaded: null,
    gestioneUtentiIsLoaded: true,
};

@State<AppStateModel>({
    name: 'appState',
    defaults: appStateDefaults
})
export class AppState {

    @Selector([ SignalRState, RouterState ])
    static appIsLoaded(state: AppStateModel, signalRState: SignalRStateModel, routerState: RouterStateModel) {
        const currentUrl = routerState.state.url;
        let currentPage = true;
        if (currentUrl === '/home') {
            currentPage = state.mapIsLoaded;
        } else if (currentUrl === '/gestione-utenti') {
            currentPage = state.gestioneUtentiIsLoaded;
        }
        let signalR = true;
        if (signalRState.reconnected === null) {
            signalR = signalRState.connected && !!signalRState.connectionId && !signalRState.disconnected;
        }
        return state.appIsLoaded && signalR && currentPage;
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

    @Action(SetMapLoaded)
    setMapLoaded({ patchState }: StateContext<AppStateModel>, { mapIsLoaded }: SetMapLoaded) {
        patchState({ mapIsLoaded });
    }

    @Action(SetGestioneUtentiLoaded)
    setGestioneUtentiLoaded({ patchState }: StateContext<AppStateModel>, { gestioneUtentiIsLoaded }: SetGestioneUtentiLoaded) {
        patchState({ gestioneUtentiIsLoaded });
    }
}
