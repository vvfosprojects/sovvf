import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
    ReloadApp,
    SetVistaSedi,
    SetTimeSync,
    ClearVistaSedi,
    SetMapLoaded, SetCurrentUrl
} from '../../actions/app/app.actions';
import { SetCodiceSede } from '../../../../core/signalr/store/signalR.actions';
import { SignalRState, SignalRStateModel } from '../../../../core/signalr/store/signalR.state';
import { Navigate, RouterState } from '@ngxs/router-plugin';
import { RouterStateModel } from '@ngxs/router-plugin/src/router.state';
import { RoutesPath } from '../../../enum/routes-path.enum';
import { UtenteState, UtenteStateModel } from '../../../../features/navbar/store/states/operatore/utente.state';

export interface AppStateModel {
    previusUrl: string;
    appIsLoaded: boolean;
    vistaSedi: string[];
    offsetTimeSync: number;
    mapIsLoaded: boolean;
}

export const appStateDefaults: AppStateModel = {
    previusUrl: RoutesPath.Home,
    appIsLoaded: true,
    vistaSedi: null,
    offsetTimeSync: 0,
    mapIsLoaded: null
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

    @Selector([ UtenteState ])
    static previusUrl(state: AppStateModel, utenteState: UtenteStateModel) {
        const userLogged = utenteState.utente;
        return userLogged ? state.previusUrl : RoutesPath.Login;
    }

    @Action(ReloadApp)
    reloadApp({ dispatch }: StateContext<AppStateModel>) {
        dispatch(new Navigate([ `/${RoutesPath.Logged}` ]));
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

    @Action(SetCurrentUrl)
    setCurrentUrl({ patchState }: StateContext<AppStateModel>, { previusUrl }: SetCurrentUrl) {
        patchState({ previusUrl });
    }

}
